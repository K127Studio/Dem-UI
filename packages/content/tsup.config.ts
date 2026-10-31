import { defineConfig } from "tsup";

export default defineConfig({
  entry: {"index": "src/index.ts", "editors": "src/editors/index.tsx"},
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "@dem-ui/foundation", "@dem-ui/base", "@dem-ui/functional"],
  banner: { js: '"use client";' },
});
