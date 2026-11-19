import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { readColorModeCookie } from "./colorMode";
import { defineTheme } from "./defineTheme";
import { UIProvider, useThemeMode } from "./UIProvider";

const theme = defineTheme({ name: "t" });

describe("readColorModeCookie", () => {
  it("finds the mode among other cookies", () => {
    expect(readColorModeCookie("a=1; dem-ui-mode=dark; b=2")).toBe("dark");
    expect(readColorModeCookie("my-mode=light", "my-mode")).toBe("light");
  });

  it("ignores missing and invalid values", () => {
    expect(readColorModeCookie(undefined)).toBeUndefined();
    expect(readColorModeCookie("dem-ui-mode=blue")).toBeUndefined();
    expect(readColorModeCookie("other-dem-ui-mode=dark")).toBeUndefined();
  });
});

describe("provider-managed colour mode", () => {
  function Probe() {
    const { mode, isDark } = useThemeMode();
    return <span>{`${mode}:${isDark}`}</span>;
  }

  it("renders the saved mode on the server, so the first paint is right", () => {
    const html = renderToString(
      <UIProvider theme={theme} colorMode={{ defaultMode: "dark" }}>
        <Probe />
      </UIProvider>,
    );
    expect(html).toContain('data-mode="dark"');
    expect(html).toContain("dark:true");
  });

  it("falls back to the mode of the config", () => {
    const html = renderToString(
      <UIProvider config={{ theme, mode: "dark", colorMode: true }} colorMode={{ defaultMode: undefined }}>
        <Probe />
      </UIProvider>,
    );
    expect(html).toContain("dark:true");
  });

  it("explains what is missing when no provider manages the mode", () => {
    expect(() => renderToString(<UIProvider theme={theme}><Probe /></UIProvider>)).toThrow(/colorMode/);
  });
});
