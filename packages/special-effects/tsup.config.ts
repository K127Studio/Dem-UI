import { defineConfig } from "tsup";

export default defineConfig({
  entry: {"chrome-blob": "src/chrome-blob.tsx", "grainient": "src/grainient.tsx"},
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "@dem-ui/foundation", "@dem-ui/foundation/utils", "@dem-ui/foundation/utils", "three", "ogl"],
  banner: { js: '"use client";' },
});
