import { execSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import { applyPlan, planInit, THEMES, type Framework, type ThemeName } from "./init";

const HELP = `Usage: dem-ui init [options]

Creates dem-ui.config.ts, adds the Dem UI imports to your stylesheet and lists what is left.

Options:
  --theme <name>     ${THEMES.join(", ")}
  --framework <fw>   next or react (detected from package.json)
  --css <path>       the stylesheet that imports Tailwind (detected)
  --install          also installs the missing packages
  --force            replaces an existing config file
  --dry-run          shows the changes without writing them
  -h, --help         this text
`;

const isTheme = (value: unknown): value is ThemeName => THEMES.includes(value as ThemeName);

async function askTheme(): Promise<ThemeName> {
  if (!process.stdin.isTTY) return "base";
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  THEMES.forEach((theme, index) => console.log(`  ${index + 1}. ${theme}`));
  const answer = (await rl.question("Theme (number or name, Enter for base): ")).trim();
  rl.close();
  const byNumber = THEMES[Number(answer) - 1];
  return byNumber ?? (isTheme(answer) ? answer : "base");
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      theme: { type: "string" },
      framework: { type: "string" },
      css: { type: "string" },
      install: { type: "boolean" },
      force: { type: "boolean" },
      "dry-run": { type: "boolean" },
      help: { type: "boolean", short: "h" },
    },
  });
  if (values.help || positionals[0] !== "init") {
    console.log(HELP);
    process.exit(values.help ? 0 : 1);
  }
  if (values.theme !== undefined && !isTheme(values.theme)) throw new Error(`Unknown theme "${values.theme}". Themes: ${THEMES.join(", ")}.`);
  if (values.framework !== undefined && values.framework !== "next" && values.framework !== "react") throw new Error("--framework is next or react.");

  const cwd = process.cwd();
  const theme = values.theme ?? (await askTheme());
  const dryRun = values["dry-run"] ?? false;
  const plan = planInit({ cwd, theme, framework: values.framework as Framework | undefined, css: values.css, force: values.force });

  console.log(`\nDem UI, ${theme} theme, ${plan.framework === "next" ? "Next.js" : "React"}:\n`);
  for (const file of plan.files) console.log(`  ${file.action.padEnd(6)} ${file.path}${file.reason ? `: ${file.reason}` : ""}`);
  if (dryRun) console.log("\nDry run: nothing written.");
  else applyPlan(cwd, plan);

  if (plan.install) {
    if (values.install && !dryRun) {
      console.log(`\n> ${plan.install}`);
      execSync(plan.install, { stdio: "inherit", cwd });
    } else {
      console.log(`\nInstall:\n   ${plan.install}`);
    }
  }
  console.log(`\nThen:\n${plan.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
