import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "@dem-ui/foundation", "@dem-ui/foundation/utils", "@dem-ui/toggle-seventies", "@dem-ui/toggle-skeuomorphic"],
  banner: { js: '"use client";' },
});
