import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { defineConfig } from "./defineConfig";
import { defineTheme } from "./defineTheme";
import { coreRecipes } from "./recipes";
import { mergeRecipes, UIProvider, useStyles, useUI, type UIProviderProps } from "./UIProvider";

const theme = defineTheme({
  name: "t",
  recipes: { badge: { slots: { root: "theme-class" } } },
  fontOptions: { primary: [{ family: "Gloock", label: "Gloock", fallback: "serif" }], secondary: [], secondaryRoles: ["body"] },
});

/** Renders a provider and returns what its children see, plus the scope element's markup. */
function probe(props: Omit<UIProviderProps, "children">) {
  let seen: { ui: ReturnType<typeof useUI>; badge: string } | undefined;
  function Probe() {
    const styles = useStyles("badge");
    seen = { ui: useUI(), badge: styles("root") };
    return null;
  }
  const html = renderToString(
    <UIProvider {...props}>
      <Probe />
    </UIProvider>,
  );
  return { html, ...seen! };
}

describe("UIProvider config", () => {
  it("applies the theme, mode and density of the config", () => {
    const { html } = probe({ config: defineConfig({ theme, mode: "dark", density: "compact" }) });
    expect(html).toContain('data-theme="t"');
    expect(html).toContain('data-mode="dark"');
    expect(html).toContain('data-density="compact"');
  });

  it("lets the provider props win over the config", () => {
    const { html, ui } = probe({ config: { theme, mode: "dark", labels: { close: "Chiudi", cancel: "Annulla" } }, mode: "light", labels: { close: "Esci" } });
    expect(html).toContain('data-mode="light"');
    expect(ui.labels.close).toBe("Esci");
    expect(ui.labels.cancel).toBe("Annulla");
  });

  it("orders tokens: fonts, then config tokens, then overrides", () => {
    const { html } = probe({
      config: { theme, fonts: { primary: "Gloock" }, tokens: { primary: "red", accent: "blue" } },
      overrides: { tokens: { primary: "green" } },
    });
    expect(html).toContain("--ui-font-display:&quot;Gloock&quot;, serif");
    expect(html).toContain("--ui-primary:green");
    expect(html).toContain("--ui-accent:blue");
  });

  it("merges recipes after the theme and before overrides", () => {
    const { badge } = probe({
      config: { theme, recipes: { badge: { slots: { root: "config-class" } } } },
      overrides: { recipes: { badge: { slots: { root: "override-class" } } } },
    });
    const order = ["theme-class", "config-class", "override-class"].map((c) => badge.indexOf(c));
    expect(order.every((index) => index >= 0)).toBe(true);
    expect(order).toEqual([...order].sort((x, y) => x - y));
  });

  it("uses a Link from the config unless the props give one", () => {
    const ConfigLink = () => null;
    const PropLink = () => null;
    expect(probe({ config: { Link: ConfigLink } }).ui.Link).toBe(ConfigLink);
    expect(probe({ config: { Link: ConfigLink }, Link: PropLink }).ui.Link).toBe(PropLink);
  });

  it("adds no wrapper element when nothing scopes", () => {
    expect(probe({ config: { labels: { close: "Chiudi" } } }).html).toBe("");
  });
});

describe("mergeRecipes", () => {
  it("replaces conflicting classes and keeps the rest", () => {
    const merged = mergeRecipes(coreRecipes, { button: { variants: { variant: { primary: "bg-rose-700" } } } });
    const primary = merged.button.variants?.variant?.primary;
    expect(primary).toContain("bg-rose-700");
    expect(primary).not.toMatch(/(^| )bg-primary( |$)/);
    expect(primary).toContain("text-on-primary");
  });

  it("adds a variant that did not exist", () => {
    const merged = mergeRecipes(coreRecipes, { button: { variants: { variant: { brand: "bg-black" } } } });
    expect(merged.button.variants?.variant?.brand).toBe("bg-black");
  });

  it("leaves the base untouched", () => {
    const before = coreRecipes.button.slots.root;
    mergeRecipes(coreRecipes, { button: { slots: { root: "p-9" } } });
    expect(coreRecipes.button.slots.root).toBe(before);
  });
});
