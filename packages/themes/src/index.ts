import base from "@dem-ui/theme-base";
import neobrutalism from "@dem-ui/theme-neobrutalism";
import industrial from "@dem-ui/theme-industrial";
import editorial from "@dem-ui/theme-editorial";
import glass from "@dem-ui/theme-glass";
import retro from "@dem-ui/theme-retro";

export { base, neobrutalism, industrial, editorial, glass, retro };

/** Every theme, by name. Importing this pulls all of them in: prefer a single theme package in an app. */
export const themes = { base, neobrutalism, industrial, editorial, glass, retro };
export type ThemeName = keyof typeof themes;
