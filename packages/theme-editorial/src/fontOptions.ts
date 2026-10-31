import type { FontOptions } from "@dem-ui/foundation";

export const fontOptions: FontOptions = {
  primary: [
    { family: "Fraunces Variable", label: "Fraunces", fallback: "serif", package: "@fontsource-variable/fraunces" },
    { family: "Instrument Serif", label: "Instrument Serif", fallback: "serif", package: "@fontsource/instrument-serif" },
    { family: "DM Serif Display", label: "DM Serif Display", fallback: "serif", package: "@fontsource/dm-serif-display" },
    { family: "Playfair Display", label: "Playfair Display", fallback: "serif", package: "@fontsource/playfair-display" },
    { family: "Bodoni Moda", label: "Bodoni Moda", fallback: "serif", package: "@fontsource/bodoni-moda" },
  ],
  secondary: [
    { family: "Newsreader", label: "Newsreader", fallback: "serif", package: "@fontsource/newsreader" },
    { family: "EB Garamond", label: "EB Garamond", fallback: "serif", package: "@fontsource/eb-garamond" },
    { family: "Lora", label: "Lora", fallback: "serif", package: "@fontsource/lora" },
    { family: "Libre Baskerville", label: "Libre Baskerville", fallback: "serif", package: "@fontsource/libre-baskerville" },
    { family: "Cormorant Garamond", label: "Cormorant Garamond", fallback: "serif", package: "@fontsource/cormorant-garamond" },
  ],
  secondaryRoles: ["body"],
};
