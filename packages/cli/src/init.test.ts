import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { addCssImports, applyPlan, planInit } from "./init";

let cwd: string;
const write = (path: string, content: string) => {
  mkdirSync(dirname(join(cwd, path)), { recursive: true });
  writeFileSync(join(cwd, path), content);
};
const read = (path: string) => readFileSync(join(cwd, path), "utf8");

beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), "dem-ui-init-"));
});
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

describe("planInit", () => {
  it("sets up a Next.js app", () => {
    write("package.json", JSON.stringify({ dependencies: { next: "16.0.0" } }));
    write("tsconfig.json", "{}");
    write("pnpm-lock.yaml", "");
    write("app/globals.css", '@import "tailwindcss";\n\nbody { margin: 0; }\n');
    write("app/layout.tsx", "export default function Layout() {}");

    const plan = planInit({ cwd, theme: "industrial" });
    applyPlan(cwd, plan);

    expect(plan.framework).toBe("next");
    expect(plan.install).toBe("pnpm add @dem-ui/next @dem-ui/theme-industrial");
    expect(read("dem-ui.config.ts")).toContain('import industrial from "@dem-ui/theme-industrial";');
    expect(read("dem-ui.config.ts")).toContain('import { defineConfig } from "@dem-ui/next";');
    expect(read("app/globals.css")).toBe('@import "tailwindcss";\n@import "@dem-ui/next/styles.css";\n@import "@dem-ui/theme-industrial/theme.css";\n\nbody { margin: 0; }\n');
    expect(plan.steps.join("\n")).toContain('import config from "../dem-ui.config";');
  });

  it("sets up a React app with plain JavaScript", () => {
    write("package.json", JSON.stringify({ dependencies: { react: "19.0.0", "@dem-ui/core": "1.0.0" } }));
    write("src/index.css", '@import "tailwindcss";\n');

    const plan = planInit({ cwd, theme: "retro" });
    applyPlan(cwd, plan);

    expect(plan.framework).toBe("react");
    expect(plan.install).toBe("npm install @dem-ui/theme-retro");
    expect(read("dem-ui.config.js")).toContain('from "@dem-ui/core"');
    expect(read("src/index.css")).toContain('@import "@dem-ui/core/styles.css";');
  });

  it("keeps an existing config unless forced, and does not import twice", () => {
    write("package.json", "{}");
    write("dem-ui.config.ts", "// mine");
    write("src/index.css", '@import "tailwindcss";\n@import "@dem-ui/core/styles.css";\n@import "@dem-ui/theme-base/theme.css";\n');

    const plan = planInit({ cwd, theme: "base" });
    expect(plan.files.map((file) => file.action)).toEqual(["skip", "skip"]);
    applyPlan(cwd, plan);
    expect(read("dem-ui.config.ts")).toBe("// mine");

    const forced = planInit({ cwd, theme: "glass", force: true });
    applyPlan(cwd, forced);
    expect(read("dem-ui.config.ts")).toContain("@dem-ui/theme-glass");
  });

  it("explains the stylesheet when there is none", () => {
    write("package.json", "{}");
    const plan = planInit({ cwd, theme: "base" });
    expect(plan.files).toHaveLength(1);
    expect(plan.steps[0]).toContain('@import "@dem-ui/theme-base/theme.css";');
  });
});

describe("addCssImports", () => {
  it("goes after the leading imports when Tailwind is not imported", () => {
    const { css } = addCssImports('/* site */\n@import "./reset.css";\n.a { color: red; }', ["@import \"x\";"]);
    expect(css).toBe('/* site */\n@import "./reset.css";\n@import "x";\n.a { color: red; }');
  });

  it("keeps Windows line endings", () => {
    expect(addCssImports('@import "tailwindcss";\r\n', ['@import "x";']).css).toBe('@import "tailwindcss";\r\n@import "x";\r\n');
  });
});
