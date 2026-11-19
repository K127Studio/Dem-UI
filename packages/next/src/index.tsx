import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { UIProvider, type DemConfig, type UIProviderProps } from "@dem-ui/foundation";
// The project's dem-ui.config when next.config uses withDemUI, otherwise nothing.
import projectConfig from "@dem-ui/next/project-config";

export type DemProviderProps = UIProviderProps;

const nextConfig: DemConfig = { Link, Image };

/**
 * `UIProvider` for Next.js. It can sit directly in a server layout: `theme` crosses the boundary
 * because theme packages are client modules, and so does a `dem-ui.config.ts` that starts with
 * `"use client"`. It is the page by default, so `<body>` needs no class. `next/link` and
 * `next/image` come first, so a `Link` in the config or in the props replaces them, such as the
 * one next-intl creates for localized routes. With `withDemUI` in next.config, the project's
 * `dem-ui.config` applies without being passed; a `config` prop still goes on top of it.
 */
export function DemProvider({ config, ...props }: DemProviderProps) {
  const configs = useMemo(
    () => (Array.isArray(config) ? [nextConfig, projectConfig, ...config] : [nextConfig, projectConfig, config as DemConfig | undefined]),
    [config],
  );
  return <UIProvider isPage config={configs} {...props} />;
}

export { defineConfig, type DemConfig } from "@dem-ui/foundation";
