import type { FontOptions } from "@dem-ui/foundation";

export const fontOptions: FontOptions = {
  primary: [
    { family: "Geist Sans", label: "Geist Sans", fallback: "sans-serif", package: "@fontsource/geist-sans" },
    { family: "Manrope", label: "Manrope", fallback: "sans-serif", package: "@fontsource/manrope" },
    { family: "Sora", label: "Sora", fallback: "sans-serif", package: "@fontsource/sora" },
    { family: "Plus Jakarta Sans", label: "Plus Jakarta Sans", fallback: "sans-serif", package: "@fontsource/plus-jakarta-sans" },
    { family: "Outfit", label: "Outfit", fallback: "sans-serif", package: "@fontsource/outfit" },
  ],
  secondary: [
    { family: "DM Sans", label: "DM Sans", fallback: "sans-serif", package: "@fontsource/dm-sans" },
    { family: "Public Sans", label: "Public Sans", fallback: "sans-serif", package: "@fontsource/public-sans" },
    { family: "Work Sans", label: "Work Sans", fallback: "sans-serif", package: "@fontsource/work-sans" },
    { family: "Karla", label: "Karla", fallback: "sans-serif", package: "@fontsource/karla" },
    { family: "Nunito", label: "Nunito", fallback: "sans-serif", package: "@fontsource/nunito" },
  ],
  secondaryRoles: ["body", "interactive"],
};
