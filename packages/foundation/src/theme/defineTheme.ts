import type { ThemeComponent, VariantValue } from "./recipes";
import type { IconName, IconComponent } from "./icons";

/** Classes to change or add per component. They merge with what the theme chain already has. */
export type Recipes = Partial<
  Record<ThemeComponent, { slots?: Record<string, string>; variants?: Record<string, Record<string, VariantValue>> }>
>;

/** Identity helper: gives a recipes object its type and autocompletion. */
export const createRecipes = (recipes: Recipes): Recipes => recipes;

/** Default props per component, for instance `{ card: { variant: "outline" } }`. */
export type ComponentDefaults = Partial<Record<ThemeComponent, Record<string, unknown>>>;

export interface FontDeclaration {
  family: string;
  /** The `--ui-font-*` tokens it fills. */
  roles: ("display" | "body" | "interactive" | "mono")[];
}

export interface FontChoice {
  /** CSS family name. */
  family: string;
  label: string;
  /** Generic family used while it loads: "serif", "sans-serif", "monospace". */
  fallback: string;
  /** The package providing it, to install when you keep this choice. */
  package?: string;
}

/** Fonts that suit a theme besides its own. Loaded by the theme's fonts-alternatives.css. */
export interface FontOptions {
  primary: FontChoice[];
  secondary: FontChoice[];
  /** The tokens a secondary font fills. The primary always fills `font-display`. */
  secondaryRoles: ("body" | "interactive" | "mono")[];
}

export interface ThemeDefinition {
  /** Matches the `[data-theme~="name"]` selector of the theme's tokens.css. */
  name: string;
  /** Parent theme: its tokens, recipes, defaults and icons apply unless replaced. */
  extends?: ThemeDefinition;
  recipes?: Recipes;
  defaults?: ComponentDefaults;
  icons?: Partial<Record<IconName, IconComponent>>;
  /** Documentation of the theme's fonts, for selectors and previews. */
  fonts?: FontDeclaration[];
  /** Alternatives to choose from: pass the result of `selectFonts` to `overrides.tokens`. */
  fontOptions?: FontOptions;
  meta?: { label?: string; description?: string; modes?: ("light" | "dark")[] };
}

export const defineTheme = (theme: ThemeDefinition): ThemeDefinition => theme;

/** Oldest first, so later entries win when merged. */
export function themeChain(theme: ThemeDefinition | undefined): ThemeDefinition[] {
  const chain: ThemeDefinition[] = [];
  for (let current = theme; current; current = current.extends) chain.unshift(current);
  return chain;
}

const fontValue = (choice: FontChoice) => `"${choice.family}", ${choice.fallback}`;

/** Token overrides for a choice of fonts, by family or label. Omit one to keep the theme's. */
export function selectFonts(theme: ThemeDefinition, choice: { primary?: string; secondary?: string }): Record<string, string> {
  const options = theme.fontOptions;
  if (!options) return {};
  const find = (list: FontChoice[], name?: string) => list.find((font) => font.family === name || font.label === name);
  const tokens: Record<string, string> = {};
  const primary = find(options.primary, choice.primary);
  if (primary) tokens["font-display"] = fontValue(primary);
  const secondary = find(options.secondary, choice.secondary);
  if (secondary) for (const role of options.secondaryRoles) tokens[`font-${role}`] = fontValue(secondary);
  return tokens;
}
