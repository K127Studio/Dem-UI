import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const pkg = (path: string) => fileURLToPath(new URL(`../../../packages/${path}`, import.meta.url));

const THEMES = ["base", "neobrutalism", "industrial", "editorial", "glass", "retro"];

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  viteFinal: (vite) => {
    vite.plugins = [...(vite.plugins ?? []), tailwindcss()];
    // Stories run on the sources, so nothing has to be built first.
    vite.resolve = {
      ...vite.resolve,
      alias: [
        { find: /^@dem-ui\/foundation\/utils$/, replacement: pkg("foundation/src/utils/index.ts") },
        { find: /^@dem-ui\/foundation\/tokens$/, replacement: pkg("foundation/styles/tokens.json") },
        { find: /^@dem-ui\/foundation$/, replacement: pkg("foundation/src/index.ts") },
        { find: /^@dem-ui\/base$/, replacement: pkg("base/src/index.ts") },
        { find: /^@dem-ui\/functional$/, replacement: pkg("functional/src/index.ts") },
        { find: /^@dem-ui\/content\/editors$/, replacement: pkg("content/src/editors/index.tsx") },
        { find: /^@dem-ui\/content$/, replacement: pkg("content/src/index.ts") },
        { find: /^@dem-ui\/ui$/, replacement: pkg("ui/src/index.ts") },
        { find: /^@dem-ui\/core$/, replacement: pkg("core/src/index.ts") },
        { find: /^@dem-ui\/icons-lucide$/, replacement: pkg("icons-lucide/src/index.ts") },
        { find: /^@dem-ui\/themes$/, replacement: pkg("themes/src/index.ts") },
        { find: /^@dem-ui\/flags$/, replacement: pkg("flags/src/index.tsx") },
        { find: /^@dem-ui\/toggles$/, replacement: pkg("toggles/src/index.ts") },
        { find: /^@dem-ui\/toggle-seventies$/, replacement: pkg("toggle-seventies/src/index.tsx") },
        { find: /^@dem-ui\/toggle-skeuomorphic$/, replacement: pkg("toggle-skeuomorphic/src/index.tsx") },
        { find: "@dem-ui/special-effects/chrome-blob", replacement: pkg("special-effects/src/chrome-blob.tsx") },
        { find: "@dem-ui/special-effects/grainient", replacement: pkg("special-effects/src/grainient.tsx") },
        ...THEMES.map((name) => ({
          find: new RegExp(`^@dem-ui/theme-${name}$`),
          replacement: pkg(`theme-${name}/src/index.ts`),
        })),
      ],
    };
    return vite;
  },
};

export default config;
