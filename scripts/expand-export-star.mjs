// Next.js with webpack rejects `export *` in a "use client" module. After a build, this rewrites each
// `export * from "x"` of the package's client bundles into the names x exports, read from x's
// built JavaScript. Usage: node scripts/expand-export-star.mjs <package dir>
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { init, parse } from "es-module-lexer";

const STAR = /^export \* from (["'])([^"']+)\1;?[ \t]*$/gm;

/** The built file a specifier points to, through the `import` condition of the package exports. */
export function resolveModule(specifier, fromFile) {
  if (specifier.startsWith(".")) {
    const path = resolve(dirname(fromFile), specifier);
    for (const candidate of [path, `${path}.js`, join(path, "index.js")]) if (existsSync(candidate)) return candidate;
    throw new Error(`Cannot resolve ${specifier} from ${fromFile}`);
  }
  const parts = specifier.split("/");
  const name = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
  const subpath = `.${specifier.slice(name.length)}` || ".";
  for (let dir = dirname(fromFile); ; dir = dirname(dir)) {
    const pkgDir = join(dir, "node_modules", name);
    if (existsSync(join(pkgDir, "package.json"))) {
      const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
      const entry = pkg.exports?.[subpath === "." ? "." : subpath] ?? (subpath === "." ? pkg.module ?? pkg.main : undefined);
      const target = typeof entry === "string" ? entry : entry?.import ?? entry?.default;
      if (!target) throw new Error(`${name} does not export ${subpath}`);
      return join(pkgDir, target);
    }
    if (dirname(dir) === dir) throw new Error(`Cannot find ${name} from ${fromFile}`);
  }
}

/** Every name a built module exports, following its own `export *`, without `default`. */
export function exportNames(file, seen = new Set()) {
  if (seen.has(file)) return new Set();
  seen.add(file);
  const source = readFileSync(file, "utf8");
  const [, exports] = parse(source);
  const names = new Set(exports.map((entry) => entry.n).filter((name) => name !== "default"));
  for (const [, , specifier] of source.matchAll(STAR)) {
    for (const name of exportNames(resolveModule(specifier, file), seen)) names.add(name);
  }
  return names;
}

/** Rewrites one file. Returns the names a star could not export because two stars share them. */
export function expandFile(file) {
  const source = readFileSync(file, "utf8");
  const stars = [...source.matchAll(STAR)];
  if (!stars.length) return { changed: false, ambiguous: [] };

  const [, ownExports] = parse(source.replace(STAR, ""));
  const own = new Set(ownExports.map((entry) => entry.n));
  const owners = new Map();
  for (const [, , specifier] of stars) {
    for (const name of exportNames(resolveModule(specifier, file))) {
      if (own.has(name)) continue;
      owners.set(name, [...(owners.get(name) ?? []), specifier]);
    }
  }
  // As with `export *` itself, a name two stars provide is ambiguous and left out.
  const ambiguous = [...owners].filter(([, from]) => new Set(from).size > 1).map(([name, from]) => `${name} (${from.join(", ")})`);

  const output = source.replace(STAR, (_line, _quote, specifier) => {
    const names = [...owners].filter(([, from]) => from.length === 1 && from[0] === specifier).map(([name]) => name).sort();
    return names.length ? `export { ${names.join(", ")} } from "${specifier}";` : "";
  });
  writeFileSync(file, output);
  return { changed: true, ambiguous };
}

function* clientFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* clientFiles(path);
    else if (entry.name.endsWith(".js") && /^["']use client["']/.test(readFileSync(path, "utf8"))) yield path;
  }
}

if (process.argv[1] && import.meta.filename === resolve(process.argv[1])) {
  await init;
  const packageDir = resolve(process.argv[2] ?? ".");
  for (const file of clientFiles(join(packageDir, "dist"))) {
    const { changed, ambiguous } = expandFile(file);
    if (changed) console.log(`expanded export * in ${file.slice(packageDir.length + 1)}`);
    for (const name of ambiguous) console.warn(`  left out, exported twice: ${name}`);
  }
}
