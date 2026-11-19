import type { FontChoice, FontOptions, ThemeDefinition } from "./defineTheme";

declare const process: { env: { NODE_ENV?: string } };

/** True outside production builds. Bundlers replace the expression; plain browsers have no `process`. */
export function isDev(): boolean {
  try {
    return process.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
}

const warned = new Set<string>();

export function warnOnce(message: string) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`[dem-ui] ${message}`);
}

const find = (list: readonly FontChoice[], name: string) => list.find((font) => font.family === name || font.label === name);

/** The chosen fonts that the theme offers, and a warning for each one it does not. */
export function checkFontNames(theme: ThemeDefinition, fonts: { primary?: string; secondary?: string }): FontChoice[] {
  const options: FontOptions | undefined = theme.fontOptions;
  const found: FontChoice[] = [];
  for (const kind of ["primary", "secondary"] as const) {
    const name = fonts[kind];
    if (!name) continue;
    const choice = options && find(options[kind], name);
    if (choice) {
      found.push(choice);
    } else {
      const offered = options?.[kind].map((font) => font.label).join(", ");
      warnOnce(`The ${kind} font "${name}" is not among the options of the "${theme.name}" theme, so the theme's own is used. ${offered ? `Options: ${offered}.` : "The theme has no font options."}`);
    }
  }
  return found;
}

/** Warns, once fonts have loaded, about chosen fonts that no stylesheet declares. */
export function checkFontsLoaded(choices: FontChoice[]) {
  if (!choices.length || typeof document === "undefined" || !document.fonts) return;
  void document.fonts.ready.then(() => {
    const declared = new Set<string>();
    document.fonts.forEach((face) => declared.add(face.family.replace(/^["']|["']$/g, "")));
    for (const choice of choices) {
      if (declared.has(choice.family)) continue;
      const source = choice.package ? `Install ${choice.package} and import its CSS, or the theme's fonts-alternatives.css.` : "Import its CSS.";
      warnOnce(`The font "${choice.family}" is chosen but not loaded, so the browser falls back to ${choice.fallback}. ${source}`);
    }
  });
}
