// Writes the token names of tokens.json as TypeScript types, so configs and overrides autocomplete
// them and reject typos. Run after changing tokens.json; a test fails while the two disagree.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const contract = JSON.parse(readFileSync(join(root, "packages/foundation/styles/tokens.json"), "utf8"));

export function renderTokenTypes({ colors, other }) {
  const list = (names) => names.map((name) => `  "${name}",`).join("\n");
  return `// Generated from styles/tokens.json by scripts/generate-tokens.mjs. Do not edit.

export const colorTokens = [
${list(colors)}
] as const;

export const otherTokens = [
${list(other)}
] as const;

/** A token name without the \`--ui-\` prefix. */
export type TokenName = (typeof colorTokens)[number] | (typeof otherTokens)[number];

/** Token values by name, without the prefix: \`{ primary: "#924044", "radius-control": "4px" }\`. */
export type Tokens = Partial<Record<TokenName, string>>;
`;
}

export const outputPath = join(root, "packages/foundation/src/theme/tokens.ts");

if (process.argv[1] && import.meta.filename === process.argv[1]) {
  writeFileSync(outputPath, renderTokenTypes(contract));
  console.log(`Wrote ${outputPath}`);
}
