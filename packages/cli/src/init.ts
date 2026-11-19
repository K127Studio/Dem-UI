import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

export const THEMES = ["base", "neobrutalism", "industrial", "editorial", "glass", "retro"] as const;
export type ThemeName = (typeof THEMES)[number];
export type Framework = "next" | "react";
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface InitOptions {
  cwd: string;
  theme: ThemeName;
  /** Detected from package.json when omitted. */
  framework?: Framework;
  /** The stylesheet that imports Tailwind. Detected when omitted. */
  css?: string;
  /** Replaces an existing config file. */
  force?: boolean;
}

export interface FileChange {
  /** Relative to the project. */
  path: string;
  action: "create" | "update" | "skip";
  content: string;
  reason?: string;
}

export interface InitPlan {
  framework: Framework;
  packageManager: PackageManager;
  files: FileChange[];
  /** The command that installs what is missing, if anything is. */
  install?: string;
  /** What is left to do by hand, in order. */
  steps: string[];
}

const CSS_CANDIDATES = [
  "app/globals.css",
  "src/app/globals.css",
  "styles/globals.css",
  "src/styles/globals.css",
  "src/index.css",
  "src/main.css",
  "src/App.css",
];

const TAILWIND_IMPORT = /@import\s+["']tailwindcss["']/;

function readJson(path: string): Record<string, unknown> | undefined {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

function dependenciesOf(cwd: string): Set<string> {
  const pkg = readJson(join(cwd, "package.json")) ?? {};
  const names = new Set<string>();
  for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
    for (const name of Object.keys((pkg[field] as Record<string, string> | undefined) ?? {})) names.add(name);
  }
  return names;
}

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  if (existsSync(join(cwd, "bun.lock")) || existsSync(join(cwd, "bun.lockb"))) return "bun";
  return "npm";
}

/** The stylesheet that imports Tailwind, or else the first usual one that exists. */
export function detectCss(cwd: string): string | undefined {
  const present = CSS_CANDIDATES.filter((path) => existsSync(join(cwd, path)));
  return present.find((path) => TAILWIND_IMPORT.test(readFileSync(join(cwd, path), "utf8"))) ?? present[0];
}

export function renderConfig(theme: ThemeName, framework: Framework): string {
  const from = framework === "next" ? "@dem-ui/next" : "@dem-ui/core";
  const provider = framework === "next" ? "DemProvider" : "UIProvider";
  return `// Dem UI settings, passed to the provider: <${provider} config={config}>.
// "use client" lets components such as icons or a router Link reach the provider.
"use client";
import { defineConfig } from "${from}";
import ${theme} from "@dem-ui/theme-${theme}";

export default defineConfig({
  theme: ${theme},
  // mode: "dark",
  // fonts: { primary: "...", secondary: "..." },
  // tokens: { primary: "#924044", "radius-control": "4px" },
  // recipes: { button: { slots: { root: "tracking-wide" } } },
  // defaults: { card: { variant: "outline" } },
  // labels: { close: "Close" },
});
`;
}

/** Adds the Dem UI imports after `@import "tailwindcss"`, skipping those already there. */
export function addCssImports(css: string, imports: string[]): { css: string; added: string[] } {
  const missing = imports.filter((line) => !css.includes(line));
  if (!missing.length) return { css, added: [] };
  const lines = css.split(/\r?\n/);
  let at = lines.findIndex((line) => TAILWIND_IMPORT.test(line));
  if (at === -1) {
    // No Tailwind import: go after the leading @imports, which must stay first in the file.
    for (const [index, line] of lines.entries()) {
      if (/^\s*@import\b/.test(line)) at = index;
      else if (line.trim() && !/^\s*(\/\*|\*|@charset)/.test(line)) break;
    }
  }
  lines.splice(at + 1, 0, ...missing);
  return { css: lines.join(css.includes("\r\n") ? "\r\n" : "\n"), added: missing };
}

export function planInit({ cwd, theme, framework, css, force = false }: InitOptions): InitPlan {
  const deps = dependenciesOf(cwd);
  const fw: Framework = framework ?? (deps.has("next") ? "next" : "react");
  const packageManager = detectPackageManager(cwd);
  const files: FileChange[] = [];
  const steps: string[] = [];

  const configPath = existsSync(join(cwd, "tsconfig.json")) ? "dem-ui.config.ts" : "dem-ui.config.js";
  const existing = ["dem-ui.config.ts", "dem-ui.config.js", "dem-ui.config.mjs"].find((path) => existsSync(join(cwd, path)));
  if (existing && !force) {
    files.push({ path: existing, action: "skip", content: "", reason: "already exists (--force replaces it)" });
  } else {
    files.push({ path: existing ?? configPath, action: existing ? "update" : "create", content: renderConfig(theme, fw) });
  }

  const provider = fw === "next" ? "@dem-ui/next" : "@dem-ui/core";
  const imports = [`@import "${provider}/styles.css";`, `@import "@dem-ui/theme-${theme}/theme.css";`];
  const cssPath = css ?? detectCss(cwd);
  if (cssPath && existsSync(join(cwd, cssPath))) {
    const current = readFileSync(join(cwd, cssPath), "utf8");
    const result = addCssImports(current, imports);
    files.push(
      result.added.length
        ? { path: cssPath, action: "update", content: result.css }
        : { path: cssPath, action: "skip", content: current, reason: "already imports Dem UI" },
    );
    if (!TAILWIND_IMPORT.test(current)) steps.push(`Dem UI needs Tailwind v4: add @import "tailwindcss"; at the top of ${cssPath}.`);
  } else {
    steps.push(`Add to the stylesheet that imports Tailwind v4:\n   @import "tailwindcss";\n   ${imports.join("\n   ")}`);
  }

  const wanted = [provider, `@dem-ui/theme-${theme}`].filter((name) => !deps.has(name));
  const add = { npm: "npm install", pnpm: "pnpm add", yarn: "yarn add", bun: "bun add" }[packageManager];
  const install = wanted.length ? `${add} ${wanted.join(" ")}` : undefined;

  const configModule = files[0].path.replace(/\.(ts|js|mjs)$/, "");
  if (fw === "next") {
    const layout = ["app/layout.tsx", "src/app/layout.tsx", "app/layout.jsx", "src/app/layout.jsx"].find((path) => existsSync(join(cwd, path)));
    const from = relative(dirname(join(cwd, layout ?? "app/layout.tsx")), join(cwd, configModule)).replace(/\\/g, "/");
    steps.push(
      `In ${layout ?? "app/layout.tsx"}, wrap the page:\n   import { DemProvider } from "@dem-ui/next";\n   import config from "${from.startsWith(".") ? from : `./${from}`}";\n   <body><DemProvider config={config}>{children}</DemProvider></body>`,
    );
  } else {
    steps.push(`Wrap the app:\n   import { UIProvider } from "@dem-ui/core";\n   import config from "./${configModule}";\n   <UIProvider config={config} isPage>{children}</UIProvider>`);
  }

  return { framework: fw, packageManager, files, install, steps };
}

export function applyPlan(cwd: string, plan: InitPlan) {
  for (const file of plan.files) {
    if (file.action === "skip") continue;
    const path = join(cwd, file.path);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, file.content);
  }
}
