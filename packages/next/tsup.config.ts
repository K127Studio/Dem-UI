import { defineConfig } from "tsup";

const shared = {
  format: ["esm"] as const,
  dts: true,
  sourcemap: true,
  external: ["react", "react-dom", /^next(\/|$)/, /^@dem-ui\//],
};

// The build script empties dist first: three configs run in parallel, so none may clean.
// Only `index` is client code. `server` runs in Server Components, `plugin` in next.config, and
// `project-config` is the empty stand-in that withDemUI replaces with the project's file.
export default defineConfig([
  { ...shared, entry: { server: "src/server.ts", "project-config": "src/project-config.ts" }, },
  { ...shared, entry: { plugin: "src/plugin.ts" }, platform: "node" },
  { ...shared, entry: { index: "src/index.tsx" }, banner: { js: '"use client";' } },
]);
