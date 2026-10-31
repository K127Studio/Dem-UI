import type { FontOptions } from "@dem-ui/foundation";

export const fontOptions: FontOptions = {
  primary: [
    { family: "DotGothic16", label: "DotGothic16", fallback: "monospace", package: "@fontsource/dotgothic16" },
    { family: "Major Mono Display", label: "Major Mono Display", fallback: "monospace", package: "@fontsource/major-mono-display" },
    { family: "Michroma", label: "Michroma", fallback: "sans-serif", package: "@fontsource/michroma" },
    { family: "Oxanium", label: "Oxanium", fallback: "sans-serif", package: "@fontsource/oxanium" },
    { family: "Share Tech Mono", label: "Share Tech Mono", fallback: "monospace", package: "@fontsource/share-tech-mono" },
  ],
  secondary: [
    { family: "JetBrains Mono", label: "JetBrains Mono", fallback: "monospace", package: "@fontsource/jetbrains-mono" },
    { family: "Roboto Mono", label: "Roboto Mono", fallback: "monospace", package: "@fontsource/roboto-mono" },
    { family: "DM Mono", label: "DM Mono", fallback: "monospace", package: "@fontsource/dm-mono" },
    { family: "Inconsolata", label: "Inconsolata", fallback: "monospace", package: "@fontsource/inconsolata" },
    { family: "Fira Code", label: "Fira Code", fallback: "monospace", package: "@fontsource/fira-code" },
  ],
  secondaryRoles: ["body", "interactive", "mono"],
};
