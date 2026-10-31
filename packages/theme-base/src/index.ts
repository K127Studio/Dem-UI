import { defineTheme } from "@dem-ui/foundation";
import { lucideIcons } from "@dem-ui/icons-lucide";
import { fontOptions } from "./fontOptions";

/** Neutral, plain Tailwind palette. Every other theme extends it, so all tokens always have a value. */
export default defineTheme({
  name: "base",
  icons: lucideIcons,
  fontOptions,
  fonts: [{ family: "system-ui", roles: ["display", "body", "interactive"] }],
  meta: { label: "Base", description: "Neutral starting point on the Tailwind palette.", modes: ["light", "dark"] },
});
