import { existsSync } from "node:fs";
import { relative, resolve } from "node:path";
import type { NextConfig } from "next";

/** The module `DemProvider` reads the project config from. Without the plugin it is empty. */
export const PROJECT_CONFIG_MODULE = "@dem-ui/next/project-config";

const CANDIDATES = ["dem-ui.config.ts", "dem-ui.config.tsx", "dem-ui.config.js", "dem-ui.config.mjs"];

export interface DemUIPluginOptions {
  /** Path to the config, from the project root. Found automatically when omitted. */
  config?: string;
  /** The project root. Defaults to the working directory, where `next` runs. */
  root?: string;
}

/** Finds the config file in the project root, if there is one. */
export function findConfigFile(root: string): string | undefined {
  return CANDIDATES.find((name) => existsSync(resolve(root, name)));
}

/**
 * Lets `DemProvider` load `dem-ui.config.ts` by itself, with no import in the layout:
 * `export default withDemUI({ ...nextConfig })` in `next.config.mjs`. Works with Turbopack and webpack.
 * A `config` passed to the provider still applies, on top of the file.
 */
export function withDemUI(nextConfig: NextConfig = {}, { config, root = process.cwd() }: DemUIPluginOptions = {}): NextConfig {
  const file = config ?? findConfigFile(root);
  if (!file) {
    console.warn(`[dem-ui] withDemUI found no ${CANDIDATES.join(" / ")} in ${root}. Create one with: npx dem-ui init`);
    return nextConfig;
  }
  const absolute = resolve(root, file);
  if (!existsSync(absolute)) throw new Error(`[dem-ui] withDemUI: ${absolute} does not exist.`);
  // Turbopack takes paths relative to the project root; webpack takes absolute ones.
  const fromRoot = `./${relative(root, absolute).replace(/\\/g, "/")}`;

  return {
    ...nextConfig,
    turbopack: {
      ...nextConfig.turbopack,
      resolveAlias: { ...nextConfig.turbopack?.resolveAlias, [PROJECT_CONFIG_MODULE]: fromRoot },
    },
    webpack(webpackConfig, context) {
      webpackConfig.resolve ??= {};
      webpackConfig.resolve.alias = { ...webpackConfig.resolve.alias, [PROJECT_CONFIG_MODULE]: absolute };
      return typeof nextConfig.webpack === "function" ? nextConfig.webpack(webpackConfig, context) : webpackConfig;
    },
  };
}
