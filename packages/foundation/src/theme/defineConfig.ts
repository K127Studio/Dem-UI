import type { ElementType } from "react";
import type { UseColorModeOptions } from "./colorMode";
import type { FontOptions, FontSelection, ThemeDefinition } from "./defineTheme";
import type { ThemeDensity, ThemeMode, ThemeOverrides, UILabels } from "./UIProvider";

/**
 * Project-wide settings, usually kept in `dem-ui.config.ts` and passed to the provider as
 * `config`. Everything is optional; the provider's own props win over it.
 */
export interface DemConfig<F extends FontOptions = FontOptions> extends ThemeOverrides {
  /** A config to start from, such as a brand shared by several apps. This one wins over it. */
  extends?: DemConfig<any>;
  theme?: ThemeDefinition<F>;
  mode?: ThemeMode;
  density?: ThemeDensity;
  /** Lets the provider own and remember the colour mode. See `UIProvider`'s `colorMode`. */
  colorMode?: boolean | UseColorModeOptions;
  /** One of the theme's `fontOptions`, by family or label. Omit one to keep the theme's. */
  fonts?: FontSelection<F>;
  labels?: Partial<UILabels>;
  /** Router link, such as the `Link` of next-intl. */
  Link?: ElementType;
  Image?: ElementType;
}

/** Types a config for autocompletion. It returns the object unchanged. */
export const defineConfig = <F extends FontOptions = FontOptions>(config: DemConfig<F>): DemConfig<F> => config;

export interface ResolvedConfig {
  theme?: ThemeDefinition;
  mode?: ThemeMode;
  density?: ThemeDensity;
  colorMode?: boolean | UseColorModeOptions;
  fonts: { primary?: string; secondary?: string };
  labels?: Partial<UILabels>;
  Link?: ElementType;
  Image?: ElementType;
  /** Tokens, recipes, defaults and icons of each config, oldest first. */
  layers: ThemeOverrides[];
}

/** Flattens a config, its `extends` chain and any list of configs, so later entries win. */
export function resolveConfig(config: DemConfig | readonly (DemConfig | undefined)[] | undefined): ResolvedConfig {
  const resolved: ResolvedConfig = { fonts: {}, layers: [] };
  const visit = (entry: DemConfig | undefined) => {
    if (!entry) return;
    visit(entry.extends);
    const { extends: _extends, theme, mode, density, colorMode, fonts, labels, Link, Image, tokens, recipes, defaults, icons } = entry;
    if (theme) resolved.theme = theme;
    if (mode) resolved.mode = mode;
    if (density) resolved.density = density;
    if (colorMode !== undefined) resolved.colorMode = colorMode;
    if (fonts) resolved.fonts = { ...resolved.fonts, ...fonts };
    if (labels) resolved.labels = { ...resolved.labels, ...labels };
    if (Link) resolved.Link = Link;
    if (Image) resolved.Image = Image;
    if (tokens || recipes || defaults || icons) resolved.layers.push({ tokens, recipes, defaults, icons });
  };
  for (const entry of Array.isArray(config) ? config : [config]) visit(entry as DemConfig | undefined);
  return resolved;
}
