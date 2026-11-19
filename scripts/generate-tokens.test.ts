import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { outputPath, renderTokenTypes } from "./generate-tokens.mjs";

it("keeps tokens.ts in sync with tokens.json (run: npm run generate:tokens)", () => {
  const contract = JSON.parse(readFileSync(join(import.meta.dirname, "../packages/foundation/styles/tokens.json"), "utf8"));
  expect(readFileSync(outputPath, "utf8").replace(/\r\n/g, "\n")).toBe(renderTokenTypes(contract));
});
