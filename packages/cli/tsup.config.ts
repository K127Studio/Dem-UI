import { defineConfig } from "tsup";

export default defineConfig([
  { entry: { index: "src/index.ts" }, format: ["esm"], dts: true, clean: true, platform: "node", target: "node22" },
  { entry: { cli: "src/cli.ts" }, format: ["esm"], platform: "node", target: "node22", banner: { js: "#!/usr/bin/env node" } },
]);
