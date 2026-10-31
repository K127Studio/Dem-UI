import type { FontOptions } from "@dem-ui/foundation";

export const fontOptions: FontOptions = {
  primary: [
    { family: "Archivo Black", label: "Archivo Black", fallback: "sans-serif", package: "@fontsource/archivo-black" },
    { family: "Bricolage Grotesque Variable", label: "Bricolage Grotesque", fallback: "sans-serif", package: "@fontsource-variable/bricolage-grotesque" },
    { family: "Syne", label: "Syne", fallback: "sans-serif", package: "@fontsource/syne" },
    { family: "Unbounded", label: "Unbounded", fallback: "sans-serif", package: "@fontsource/unbounded" },
    { family: "Lexend Mega", label: "Lexend Mega", fallback: "sans-serif", package: "@fontsource/lexend-mega" },
  ],
  secondary: [
    { family: "DM Sans", label: "DM Sans", fallback: "sans-serif", package: "@fontsource/dm-sans" },
    { family: "Work Sans", label: "Work Sans", fallback: "sans-serif", package: "@fontsource/work-sans" },
    { family: "Outfit", label: "Outfit", fallback: "sans-serif", package: "@fontsource/outfit" },
    { family: "Public Sans", label: "Public Sans", fallback: "sans-serif", package: "@fontsource/public-sans" },
    { family: "Rubik", label: "Rubik", fallback: "sans-serif", package: "@fontsource/rubik" },
  ],
  secondaryRoles: ["body"],
};
