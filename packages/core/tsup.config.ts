import { defineConfig } from "tsup";

const shared = {
  format: ["esm"] as const,
  dts: true,
  sourcemap: true,
  external: ["react", "react-dom", "@dem-ui/foundation", "@dem-ui/base", "@dem-ui/functional", "@dem-ui/content", "@dem-ui/ui", "@dem-ui/content/editors", "@dem-ui/foundation/utils"],
};

// `utils` carries no directive so `cn` and `renderMarkdown` stay callable from Server Components.
export default defineConfig([
  { ...shared, entry: { utils: "src/utils.ts" }, clean: true },
  {
    ...shared,
    entry: { index: "src/index.ts", base: "src/base.ts", functional: "src/functional.ts", content: "src/content.ts", "content/editors": "src/editors.ts", ui: "src/ui.ts" },
    banner: { js: '"use client";' },
  },
]);
