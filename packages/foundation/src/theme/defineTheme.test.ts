import { describe, expect, it } from "vitest";
import { defineTheme, selectFonts, themeChain } from "./defineTheme";

const theme = defineTheme({
  name: "t",
  fontOptions: {
    primary: [{ family: "Gloock", label: "Gloock", fallback: "serif" }],
    secondary: [{ family: "Lora Variable", label: "Lora", fallback: "serif" }],
    secondaryRoles: ["body", "interactive"],
  },
});

describe("selectFonts", () => {
  it("maps the primary to display and the secondary to its roles", () => {
    expect(selectFonts(theme, { primary: "Gloock", secondary: "Lora" })).toEqual({
      "font-display": '"Gloock", serif',
      "font-body": '"Lora Variable", serif',
      "font-interactive": '"Lora Variable", serif',
    });
  });

  it("ignores names the theme does not offer", () => {
    expect(selectFonts(theme, { primary: "Comic Sans" })).toEqual({});
  });

  it("returns nothing for a theme without options", () => {
    expect(selectFonts(defineTheme({ name: "x" }), { primary: "Gloock" })).toEqual({});
  });
});

describe("themeChain", () => {
  it("lists the oldest ancestor first", () => {
    const base = defineTheme({ name: "base" });
    const child = defineTheme({ name: "child", extends: base });
    expect(themeChain(child).map((t) => t.name)).toEqual(["base", "child"]);
  });
});
