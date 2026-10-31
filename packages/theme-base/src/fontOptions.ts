import type { FontOptions } from "@dem-ui/foundation";

export const fontOptions: FontOptions = {
  primary: [
    { family: "Inter Variable", label: "Inter", fallback: "sans-serif", package: "@fontsource-variable/inter" },
    { family: "Manrope", label: "Manrope", fallback: "sans-serif", package: "@fontsource/manrope" },
    { family: "DM Sans", label: "DM Sans", fallback: "sans-serif", package: "@fontsource/dm-sans" },
    { family: "Public Sans", label: "Public Sans", fallback: "sans-serif", package: "@fontsource/public-sans" },
    { family: "Outfit", label: "Outfit", fallback: "sans-serif", package: "@fontsource/outfit" },
  ],
  secondary: [
    { family: "Work Sans", label: "Work Sans", fallback: "sans-serif", package: "@fontsource/work-sans" },
    { family: "Karla", label: "Karla", fallback: "sans-serif", package: "@fontsource/karla" },
    { family: "Nunito", label: "Nunito", fallback: "sans-serif", package: "@fontsource/nunito" },
    { family: "Rubik", label: "Rubik", fallback: "sans-serif", package: "@fontsource/rubik" },
    { family: "Lora", label: "Lora", fallback: "serif", package: "@fontsource/lora" },
  ],
  secondaryRoles: ["body", "interactive"],
};
