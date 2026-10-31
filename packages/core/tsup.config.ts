import { defineConfig } from "tsup";

export default defineConfig({
  entry: {"index": "src/index.ts", "base": "src/base.ts", "functional": "src/functional.ts", "content": "src/content.ts", "content/editors": "src/editors.ts", "ui": "src/ui.ts", "utils": "src/utils.ts"},
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "@dem-ui/foundation", "@dem-ui/base", "@dem-ui/functional", "@dem-ui/content", "@dem-ui/ui", "@dem-ui/content/editors", "@dem-ui/foundation/utils"],
  banner: { js: '"use client";' },
});
