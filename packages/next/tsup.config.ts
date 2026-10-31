import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next", "next/link", "next/image", "@dem-ui/foundation", "@dem-ui/core"],
  banner: { js: '"use client";' },
});
