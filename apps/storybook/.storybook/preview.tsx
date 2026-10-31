import type { Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import { UIProvider, themeChain, type ThemeDensity, type ThemeMode } from "@dem-ui/foundation";
import { themes, type ThemeName } from "@dem-ui/themes";
import "./storybook.css";

const preview: Preview = {
  tags: ["autodocs"],
  initialGlobals: { theme: "base", mode: "light", density: "normal" },
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: { title: "Theme", icon: "paintbrush", items: Object.keys(themes), dynamicTitle: true },
    },
    mode: {
      description: "Colour mode",
      toolbar: { title: "Mode", icon: "contrast", items: ["light", "dark"], dynamicTitle: true },
    },
    density: {
      description: "Density",
      toolbar: { title: "Density", icon: "component", items: ["compact", "normal", "comfortable"], dynamicTitle: true },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = themes[context.globals.theme as ThemeName] ?? themes.base;
      const mode = context.globals.mode as ThemeMode;
      const density = context.globals.density as ThemeDensity;
      // On <html> too, so the page behind the story takes the theme's background.
      useEffect(() => {
        const html = document.documentElement;
        html.dataset.theme = [...themeChain(theme)].reverse().map((t) => t.name).join(" ");
        html.dataset.mode = mode;
        html.dataset.density = density;
        document.body.classList.add("ui-page");
      }, [theme, mode, density]);
      return (
        <UIProvider theme={theme} mode={mode} density={density}>
          <Story />
        </UIProvider>
      );
    },
  ],
  parameters: {
    controls: { expanded: true, sort: "requiredFirst" },
    options: {
      storySort: { order: ["Overview", "Themes", "Base", ["Typography", "Links", "Lists", "Media", "Layout", "Tables", "Forms", "Controls"], "Functional", "Content", "UI", "Toggles", "Special effects"] },
    },
  },
};

export default preview;
