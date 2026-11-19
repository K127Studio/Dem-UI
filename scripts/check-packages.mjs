// Lints what each package would publish: exports, files and types that resolve. Run after a build.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { publint } from "publint";
import { formatMessage } from "publint/utils";
import { readFileSync } from "node:fs";

const root = join(import.meta.dirname, "..");
let problems = 0;
for (const dir of readdirSync(join(root, "packages"))) {
  const pkgDir = join(root, "packages", dir);
  const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
  const { messages } = await publint({ pkgDir, level: "warning", strict: true });
  for (const message of messages) {
    console.log(`${pkg.name}: ${formatMessage(message, pkg)}`);
    problems++;
  }
}
if (problems) process.exit(1);
console.log("Every package is ready to publish.");
