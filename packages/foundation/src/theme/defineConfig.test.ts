import { describe, expect, it } from "vitest";
import { defineConfig, resolveConfig } from "./defineConfig";
import { defineTheme } from "./defineTheme";

const a = defineTheme({ name: "a" });
const b = defineTheme({ name: "b" });

describe("resolveConfig", () => {
  it("returns empty settings without a config", () => {
    expect(resolveConfig(undefined)).toEqual({ fonts: {}, layers: [] });
  });

  it("lets a config win over the one it extends", () => {
    const shared = defineConfig({ theme: a, mode: "dark", fonts: { primary: "X", secondary: "Y" }, labels: { close: "Shut", cancel: "No" } });
    const resolved = resolveConfig(defineConfig({ extends: shared, theme: b, fonts: { primary: "Z" }, labels: { close: "Chiudi" } }));
    expect(resolved.theme).toBe(b);
    expect(resolved.mode).toBe("dark");
    expect(resolved.fonts).toEqual({ primary: "Z", secondary: "Y" });
    expect(resolved.labels).toEqual({ close: "Chiudi", cancel: "No" });
  });

  it("keeps the layers of the chain oldest first", () => {
    const shared = defineConfig({ tokens: { primary: "red" } });
    const resolved = resolveConfig(defineConfig({ extends: shared, tokens: { primary: "blue" }, defaults: { card: { variant: "outline" } } }));
    expect(resolved.layers.map((layer) => layer.tokens)).toEqual([{ primary: "red" }, { primary: "blue" }]);
    expect(resolved.layers[1].defaults).toEqual({ card: { variant: "outline" } });
  });

  it("merges a list in order and skips empty entries", () => {
    const Link = () => null;
    const OtherLink = () => null;
    const resolved = resolveConfig([{ Link, theme: a }, undefined, { Link: OtherLink }]);
    expect(resolved.Link).toBe(OtherLink);
    expect(resolved.theme).toBe(a);
  });

  it("adds no layer for a config without tokens, recipes, defaults or icons", () => {
    expect(resolveConfig({ theme: a, mode: "light" }).layers).toEqual([]);
  });
});
