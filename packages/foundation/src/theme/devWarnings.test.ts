import { afterEach, describe, expect, it, vi } from "vitest";
import { defineTheme } from "./defineTheme";
import { checkFontNames, checkFontsLoaded, isDev } from "./devWarnings";

const theme = defineTheme({
  name: "t",
  fontOptions: {
    primary: [{ family: "Gloock", label: "Gloock", fallback: "serif", package: "@fontsource/gloock" }],
    secondary: [{ family: "Lora Variable", label: "Lora", fallback: "serif" }],
    secondaryRoles: ["body"],
  },
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("dev warnings", () => {
  it("runs outside production", () => {
    expect(isDev()).toBe(true);
  });

  it("returns the fonts the theme offers and warns about the others", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const found = checkFontNames(theme, { primary: "Gloock", secondary: "Comic Sans" });
    expect(found.map((font) => font.family)).toEqual(["Gloock"]);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('"Comic Sans" is not among the options of the "t" theme');
  });

  it("warns about a chosen font no stylesheet declares", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const faces = [{ family: '"Lora Variable"' }];
    vi.stubGlobal("document", { fonts: { ready: Promise.resolve(), forEach: (fn: (face: { family: string }) => void) => faces.forEach(fn) } });
    checkFontsLoaded([...theme.fontOptions!.primary, ...theme.fontOptions!.secondary]);
    await Promise.resolve();
    await Promise.resolve();
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('"Gloock" is chosen but not loaded');
    expect(warn.mock.calls[0][0]).toContain("@fontsource/gloock");
  });
});
