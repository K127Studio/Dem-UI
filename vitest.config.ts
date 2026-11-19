import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

// Tests run on the sources, through the same paths as the typecheck: no build needed first.
const { compilerOptions } = JSON.parse(readFileSync(resolve(import.meta.dirname, "tsconfig.json"), "utf8")) as {
  compilerOptions: { paths: Record<string, string[]> };
};
const alias = Object.entries(compilerOptions.paths)
  .sort(([a], [b]) => b.length - a.length)
  .map(([find, [target]]) => ({ find: new RegExp(`^${find.replace(/[/.]/g, "\$&")}$`), replacement: resolve(import.meta.dirname, target) }));

export default defineConfig({
  resolve: { alias },
  test: { include: ["packages/**/src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"] },
});
