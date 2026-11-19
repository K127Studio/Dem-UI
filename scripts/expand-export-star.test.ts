import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { init } from "es-module-lexer";
import { afterEach, beforeAll, beforeEach, expect, it } from "vitest";
import { expandFile } from "./expand-export-star.mjs";

let root: string;
const write = (path: string, content: string) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
};

beforeAll(async () => {
  await init;
});
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "dem-ui-star-"));
  write("node_modules/@x/a/package.json", JSON.stringify({ name: "@x/a", exports: { ".": { import: "./index.js" } } }));
  write("node_modules/@x/a/index.js", 'export const A = 1;\nexport function shared() {}\nexport default 0;\nexport * from "./more.js";\n');
  write("node_modules/@x/a/more.js", "const m = 2;\nexport { m as More };\n");
  write("node_modules/@x/b/package.json", JSON.stringify({ name: "@x/b", exports: { ".": "./index.js" } }));
  write("node_modules/@x/b/index.js", "export class B {}\nexport const shared = 1;\nexport const Local = 3;\n");
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

it("turns each export * into named exports, as ESM would resolve them", () => {
  write("pkg/dist/index.js", '"use client";\nexport * from "@x/a";\nexport * from "@x/b";\nconst Local = 4;\nexport { Local };\n');
  const { ambiguous } = expandFile(join(root, "pkg/dist/index.js"));

  expect(readFileSync(join(root, "pkg/dist/index.js"), "utf8")).toBe(
    '"use client";\nexport { A, More } from "@x/a";\nexport { B } from "@x/b";\nconst Local = 4;\nexport { Local };\n',
  );
  expect(ambiguous).toEqual(["shared (@x/a, @x/b)"]);
});

it("leaves a file without export * alone", () => {
  write("pkg/dist/plain.js", '"use client";\nexport const x = 1;\n');
  expect(expandFile(join(root, "pkg/dist/plain.js")).changed).toBe(false);
});
