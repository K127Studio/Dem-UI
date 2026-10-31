import { defineConfig } from "tsup";

const shared = {
  format: ["esm"] as const,
  dts: true,
  sourcemap: true,
  external: ["react", "react-dom"],
};

// `utils` carries no directive so `cn` and `renderMarkdown` stay callable from Server Components.
export default defineConfig([
  { ...shared, entry: { utils: "src/utils/index.ts" }, clean: true },
  { ...shared, entry: { index: "src/index.ts" }, banner: { js: '"use client";' } },
]);
