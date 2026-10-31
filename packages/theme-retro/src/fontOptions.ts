import type { FontOptions } from "@dem-ui/foundation";

export const fontOptions: FontOptions = {
  primary: [
    { family: "Press Start 2P", label: "Press Start 2P", fallback: "monospace", package: "@fontsource/press-start-2p" },
    { family: "Silkscreen", label: "Silkscreen", fallback: "monospace", package: "@fontsource/silkscreen" },
    { family: "Jersey 10", label: "Jersey 10", fallback: "monospace", package: "@fontsource/jersey-10" },
    { family: "Tiny5", label: "Tiny5", fallback: "monospace", package: "@fontsource/tiny5" },
    { family: "Micro 5", label: "Micro 5", fallback: "monospace", package: "@fontsource/micro-5" },
  ],
  secondary: [
    { family: "Courier Prime", label: "Courier Prime", fallback: "monospace", package: "@fontsource/courier-prime" },
    { family: "Ubuntu Mono", label: "Ubuntu Mono", fallback: "monospace", package: "@fontsource/ubuntu-mono" },
    { family: "Inconsolata", label: "Inconsolata", fallback: "monospace", package: "@fontsource/inconsolata" },
    { family: "DotGothic16", label: "DotGothic16", fallback: "monospace", package: "@fontsource/dotgothic16" },
    { family: "Share Tech Mono", label: "Share Tech Mono", fallback: "monospace", package: "@fontsource/share-tech-mono" },
  ],
  secondaryRoles: ["body", "interactive", "mono"],
};
