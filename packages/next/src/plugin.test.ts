import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PROJECT_CONFIG_MODULE, withDemUI } from "./plugin";

let root: string;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "dem-ui-plugin-"));
});
afterEach(() => {
  rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe("withDemUI", () => {
  it("aliases the project config for Turbopack and webpack, keeping the rest", () => {
    writeFileSync(join(root, "dem-ui.config.ts"), "export default {};");
    const userWebpack = vi.fn((config: { marked?: boolean }) => ({ ...config, marked: true }));
    const result = withDemUI({ reactStrictMode: true, turbopack: { resolveAlias: { a: "./a" } }, webpack: userWebpack }, { root });

    expect(result.reactStrictMode).toBe(true);
    expect(result.turbopack?.resolveAlias).toEqual({ a: "./a", [PROJECT_CONFIG_MODULE]: "./dem-ui.config.ts" });

    const out = result.webpack!({ resolve: { alias: { b: "/b" } } }, {} as never);
    expect(out.resolve.alias).toEqual({ b: "/b", [PROJECT_CONFIG_MODULE]: join(root, "dem-ui.config.ts") });
    expect(out.marked).toBe(true);
  });

  it("takes an explicit path", () => {
    writeFileSync(join(root, "ui.ts"), "export default {};");
    expect(withDemUI({}, { root, config: "ui.ts" }).turbopack?.resolveAlias).toEqual({ [PROJECT_CONFIG_MODULE]: "./ui.ts" });
    expect(() => withDemUI({}, { root, config: "missing.ts" })).toThrow(/does not exist/);
  });

  it("leaves the config alone and warns when there is no file", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const config = { reactStrictMode: true };
    expect(withDemUI(config, { root })).toBe(config);
    expect(warn.mock.calls[0][0]).toContain("npx dem-ui init");
  });
});
