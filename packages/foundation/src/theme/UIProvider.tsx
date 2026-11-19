import { createContext, useContext, useEffect, useMemo, type CSSProperties, type ElementType, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { ClassValue } from "clsx";
import { cn } from "../utils/cn";
import { useColorMode, type ColorModeControls, type UseColorModeOptions } from "./colorMode";
import { resolveConfig, type DemConfig } from "./defineConfig";
import { checkFontNames, checkFontsLoaded, isDev, warnOnce } from "./devWarnings";
import { selectFonts, themeChain, type ComponentDefaults, type Recipes, type ThemeDefinition } from "./defineTheme";
import type { IconComponent, IconName } from "./icons";
import type { Tokens } from "./tokens";
import { coreRecipes, type ComponentTheme, type RecipeSet, type ThemeComponent, type VariantValue } from "./recipes";

function mergeValue(base: VariantValue | undefined, over: VariantValue): VariantValue {
  if (base === undefined) return over;
  if (typeof base === "string" && typeof over === "string") return cn(base, over);
  const a = typeof base === "string" ? { root: base } : base;
  const b = typeof over === "string" ? { root: over } : over;
  const out: Record<string, string> = { ...a };
  for (const [slot, classes] of Object.entries(b)) out[slot] = cn(a[slot], classes);
  return out;
}

/**
 * Overrides are merged with tailwind-merge: `bg-accent` replaces `bg-primary` and leaves the
 * rest of the string alone. A variant value that does not exist yet is added, so a project can
 * have a `variant="brand"` of its own.
 */
export function mergeRecipes(base: RecipeSet, override: Recipes = {}): RecipeSet {
  const out = { ...base };
  for (const name of Object.keys(override) as ThemeComponent[]) {
    const over = override[name];
    if (!over) continue;
    const current: ComponentTheme = base[name];
    const slots = { ...current.slots };
    for (const [slot, classes] of Object.entries(over.slots ?? {})) slots[slot] = cn(slots[slot], classes);
    const variants = { ...current.variants };
    for (const [axis, values] of Object.entries(over.variants ?? {})) {
      const merged = { ...variants[axis] };
      for (const [value, classes] of Object.entries(values)) merged[value] = mergeValue(merged[value], classes);
      variants[axis] = merged;
    }
    out[name] = { slots, variants };
  }
  return out;
}

export const defaultLabels = {
  close: "Close",
  selectPlaceholder: "Select...",
  searchPlaceholder: "Search...",
  noOptions: "No results",
  confirm: "Confirm",
  cancel: "Cancel",
  delete: "Delete",
  deleteTitle: "Confirm deletion",
  noData: "No items found.",
  selectAll: "Select all",
  selectRow: "Select row",
  actions: "Actions",
  dropImage: "Drop an image or click to browse",
  removeImage: "Remove image",
  fileTooLarge: "The file is too large.",
  uploadFailed: "Upload failed.",
  selected: "selected",
  previous: "Previous",
  next: "Next",
  save: "Save changes",
  back: "Back to list",
  saving: "Saving...",
  ok: "OK",
  menu: "Menu",
  email: "Email",
  password: "Password",
  signIn: "Sign in",
  comingSoon: "Coming soon",
  moveUp: "Move up",
  moveDown: "Move down",
  remove: "Remove",
  filters: "Filters",
  clearAll: "Clear all",
  applyFilters: "Apply filters",
  perPage: "Rows per page",
  selectItems: "Select",
  language: "Language",
  page: "Page",
  of: "of",
  showing: "Showing",
  to: "to",
  items: "items",
  chooseColor: "Choose colour",
  chooseBackground: "Choose background",
  customColor: "Custom colour",
  opacity: "Opacity",
  done: "Done",
  lightMode: "Light mode",
  darkMode: "Dark mode",
  solid: "Solid",
  gradient: "Gradient",
  direction: "Direction",
  from: "From",
  via: "Via",
  useVia: "Middle colour",
  position: "Position",
  optimizing: "Optimizing...",
};
export type UILabels = typeof defaultLabels;

export interface UIImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

function DefaultImage({ fill: _fill, priority, sizes, ...props }: UIImageProps) {
  return <img {...props} sizes={sizes} loading={priority ? "eager" : "lazy"} />;
}

export type ThemeMode = "light" | "dark";
export type ThemeDensity = "compact" | "normal" | "comfortable";

interface ScopeAttributes {
  "data-theme"?: string;
  "data-mode"?: ThemeMode;
  "data-density"?: ThemeDensity;
  style?: CSSProperties;
}

interface UIContextValue {
  recipes: RecipeSet;
  defaults: ComponentDefaults;
  icons: Partial<Record<IconName, IconComponent>>;
  labels: UILabels;
  Link: ElementType;
  Image: ElementType;
  /** Copied onto every portal: a dialog in document.body still needs the tokens. */
  scope: ScopeAttributes;
  /** Set by the nearest provider that manages the colour mode. */
  colorMode?: ColorModeControls;
}

const UIContext = createContext<UIContextValue>({
  recipes: coreRecipes,
  defaults: {},
  icons: {},
  labels: defaultLabels,
  Link: "a",
  Image: DefaultImage,
  scope: {},
});

export interface ThemeOverrides {
  /** Token values without the prefix: `{ primary: "#924044", "radius-control": "4px" }`. */
  tokens?: Tokens;
  recipes?: Recipes;
  defaults?: ComponentDefaults;
  icons?: Partial<Record<IconName, IconComponent>>;
}

export interface UIProviderProps {
  children: ReactNode;
  /** A theme from `defineTheme`. Import its tokens.css too. Nested providers can change it. */
  theme?: ThemeDefinition;
  mode?: ThemeMode;
  density?: ThemeDensity;
  /**
   * Lets the provider own the colour mode: it remembers the choice (localStorage and a cookie) and
   * `useThemeMode()` reads and changes it from any child, such as a toggle. A `mode` prop still wins.
   */
  colorMode?: boolean | UseColorModeOptions;
  /**
   * Project settings, usually the default export of `dem-ui.config.ts`. A list merges in order,
   * later entries winning. The other props of the provider win over it.
   */
  config?: DemConfig | readonly (DemConfig | undefined)[];
  /** Project-level changes on top of the theme and the config. */
  overrides?: ThemeOverrides;
  /**
   * The provider's element is the page: it paints the theme's background and texture. Needed when
   * the provider sits inside `<body>`, because the tokens live on its element and not above it.
   */
  isPage?: boolean;
  /** All the built-in strings, for translations. */
  labels?: Partial<UILabels>;
  /** Router link: `next/link` or the `Link` of `next-intl`. Defaults to `<a>`. */
  Link?: ElementType;
  /** Image component: `next/image`. Defaults to `<img>`. */
  Image?: ElementType;
}

const tokenStyle = (tokens: Tokens) =>
  Object.fromEntries(Object.entries(tokens).map(([name, value]) => [`--ui-${name}`, value])) as CSSProperties;

export function UIProvider({ children, config, overrides, isPage = false, ...props }: UIProviderProps) {
  const parent = useContext(UIContext);
  const settings = useMemo(() => resolveConfig(config), [config]);
  const theme = props.theme ?? settings.theme;
  const colorModeSetting = props.colorMode ?? settings.colorMode;
  const managed = Boolean(colorModeSetting);
  const colorModeOptions: UseColorModeOptions = typeof colorModeSetting === "object" ? colorModeSetting : {};
  // Always called, as hooks must be; without a setting it stores nothing and reads nothing.
  const controls = useColorMode(
    managed
      ? { cookie: true, ...colorModeOptions, defaultMode: colorModeOptions.defaultMode ?? settings.mode }
      : { storageKey: null, defaultMode: settings.mode },
  );
  const mode = props.mode ?? (managed ? controls.mode : settings.mode);
  const density = props.density ?? settings.density;
  const labels = useMemo(
    () => (settings.labels || props.labels ? { ...settings.labels, ...props.labels } : undefined),
    [settings.labels, props.labels],
  );
  const Link = props.Link ?? settings.Link;
  const Image = props.Image ?? settings.Image;

  useEffect(() => {
    if (!isDev() || !(settings.fonts.primary || settings.fonts.secondary)) return;
    if (theme) checkFontsLoaded(checkFontNames(theme, settings.fonts));
    else warnOnce("`fonts` is set but this provider has no theme to take them from. Set `theme` in the same config or provider.");
  }, [theme, settings.fonts]);

  const value = useMemo<UIContextValue>(() => {
    const chain = themeChain(theme);
    // Fonts are looked up in the theme of this provider: an inherited theme has no options here.
    const fontTokens = theme ? selectFonts(theme, settings.fonts) : {};
    // A new theme starts from the core again, so a nested provider does not inherit the outer brand.
    let recipes = theme ? coreRecipes : parent.recipes;
    let defaults = theme ? {} : parent.defaults;
    let icons = theme ? {} : parent.icons;
    const layers = [...chain, ...settings.layers, ...(overrides ? [overrides] : [])];
    for (const layer of layers) {
      if (layer.recipes) recipes = mergeRecipes(recipes, layer.recipes);
      if (layer.defaults) {
        const merged: ComponentDefaults = { ...defaults };
        for (const [name, props] of Object.entries(layer.defaults) as [ThemeComponent, Record<string, unknown>][]) {
          merged[name] = { ...merged[name], ...props };
        }
        defaults = merged;
      }
      if (layer.icons) icons = { ...icons, ...layer.icons };
    }

    const scope: ScopeAttributes = { ...parent.scope };
    if (theme) scope["data-theme"] = [...chain].reverse().map((t) => t.name).join(" ");
    if (mode) scope["data-mode"] = mode;
    if (density) scope["data-density"] = density;
    const tokens = Object.assign({}, fontTokens, ...settings.layers.map((layer) => layer.tokens), overrides?.tokens);
    if (Object.keys(tokens).length) scope.style = { ...parent.scope.style, ...tokenStyle(tokens) };

    return {
      recipes,
      defaults,
      icons,
      scope,
      labels: labels ? { ...parent.labels, ...labels } : parent.labels,
      Link: Link ?? parent.Link,
      Image: Image ?? parent.Image,
      colorMode: managed ? controls : parent.colorMode,
    };
  }, [parent, settings, theme, mode, density, overrides, labels, Link, Image, managed, controls]);

  const needsScope = theme || mode || density || value.scope.style !== parent.scope.style;
  return (
    <UIContext.Provider value={value}>
      {needsScope ? (
        <div {...value.scope} className={isPage ? "ui-page min-h-dvh" : "contents font-body text-foreground"}>
          {children}
        </div>
      ) : (
        children
      )}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);

/**
 * The colour mode of the nearest provider with `colorMode`, to read and change it from a toggle:
 * `const { isDark, setIsDark } = useThemeMode();`.
 */
export function useThemeMode(): ColorModeControls {
  const controls = useContext(UIContext).colorMode;
  if (!controls) throw new Error("useThemeMode needs a UIProvider or DemProvider with the colorMode prop, or colorMode in its config.");
  return controls;
}

/** Renders in document.body while keeping the active theme, mode, density and token overrides. */
export function ThemedPortal({ children }: { children: ReactNode }) {
  const { scope } = useUI();
  return createPortal(
    <div {...scope} className="contents font-body text-foreground">
      {children}
    </div>,
    document.body,
  );
}

/** Fills in the props the active theme sets as defaults. Explicit props win. */
export function useDefaults<P extends object>(name: ThemeComponent, props: P): P {
  const defaults = useContext(UIContext).defaults[name];
  if (!defaults) return props;
  const defined = Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined));
  return { ...defaults, ...defined } as P;
}

export type Selection = Record<string, string | boolean | undefined>;

/**
 * The classes of a component. `selection` picks the value on each variant axis; `classNames`
 * overrides single slots for one instance. Later classes win.
 */
export function useStyles<S extends string = string>(
  name: ThemeComponent,
  selection: Selection = {},
  classNames?: Partial<Record<S, string>>,
) {
  const component = useContext(UIContext).recipes[name];
  return (slot: S, ...extra: ClassValue[]) => {
    const fromVariants: string[] = [];
    for (const [axis, value] of Object.entries(selection)) {
      if (value === undefined) continue;
      const entry = component.variants?.[axis]?.[String(value)];
      if (typeof entry === "string") {
        if (slot === "root") fromVariants.push(entry);
      } else if (entry?.[slot]) {
        fromVariants.push(entry[slot]);
      }
    }
    return cn(component.slots[slot], fromVariants, extra, classNames?.[slot]);
  };
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

/** An icon of the active theme, by meaning. Renders nothing when the set does not have it. */
export function Icon({ name, ...props }: IconProps) {
  const Component = useContext(UIContext).icons[name];
  return Component ? <Component aria-hidden="true" {...props} /> : null;
}
