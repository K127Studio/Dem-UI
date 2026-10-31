// Every theme must fill the token contract and keep its colour pairs readable (WCAG AA, 4.5:1).
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const contract = JSON.parse(readFileSync(join(root, "packages/foundation/styles/tokens.json"), "utf8"));
const required = [...contract.colors, ...contract.other];

function blocks(name) {
  const css = readFileSync(join(root, `packages/theme-${name}/tokens.css`), "utf8");
  const read = (re) => Object.fromEntries([...(css.match(re)?.[1] ?? "").matchAll(/--ui-([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  return {
    light: read(new RegExp(`\\[data-theme~="${name}"\\]\\s*\\{([\\s\\S]*?)\\n  \\}`)),
    dark: read(new RegExp(`\\[data-theme~="${name}"\\](?::where\\(|)\\[data-mode="dark"\\]\\)?\\s*\\{([\\s\\S]*?)\\n  \\}`)),
  };
}

const luminance = (hex) => {
  const v = hex.slice(1).match(/../g).map((h) => parseInt(h, 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const base = blocks("base");
const names = readdirSync(join(root, "packages")).filter((d) => d.startsWith("theme-")).map((d) => d.slice(6)).filter((n) => existsSync(join(root, `packages/theme-${n}/tokens.css`)));
let failures = 0;

for (const name of names) {
  const own = blocks(name);
  const light = { ...base.light, ...own.light };
  const dark = { ...base.light, ...base.dark, ...own.light, ...own.dark };
  for (const token of required) {
    if (!light[token]) {
      console.log(`${name}: missing --ui-${token}`);
      failures++;
    }
  }
  // A theme with no dark block looks the same in both modes unless it inherits base's dark values.
  for (const [mode, values] of [["light", light], ["dark", dark]]) {
    for (const [bg, fg] of contract.contrastPairs) {
      if (!/^#[0-9a-f]{6}$/i.test(values[bg]) || !/^#[0-9a-f]{6}$/i.test(values[fg])) continue;
      const ratio = contrast(values[bg], values[fg]);
      if (ratio < 4.5) {
        console.log(`${name} ${mode}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
        failures++;
      }
    }
  }
}
console.log(failures ? `${failures} problem(s)` : `${names.length} themes OK`);
process.exit(failures ? 1 : 0);
