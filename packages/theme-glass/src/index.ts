import { createRecipes, defineTheme } from "@dem-ui/foundation";
import { createLucideIcons } from "@dem-ui/icons-lucide";
import base from "@dem-ui/theme-base";
import { fontOptions } from "./fontOptions";

// Frosted glass only on what floats above the page: dialogs and dropdowns.
const FROST = "bg-surface/70 backdrop-blur-xl backdrop-saturate-150";
const CARD = "bg-white/[0.03] border-border";

const recipes = createRecipes({
  button: {
    slots: { root: "text-sm active:scale-[0.99]" },
    variants: {
      variant: {
        primary: "hover:bg-primary/85 hover:shadow-[0_0_24px_rgb(255_255_255/0.25)]",
        secondary: "border-(length:--ui-border-width) border-border hover:bg-white/10",
        accent: "hover:shadow-[0_0_24px_rgb(139_140_248/0.5)]",
        outline: "border-border text-foreground shadow-none hover:bg-white/5",
        ghost: "shadow-none hover:bg-white/5",
        link: "shadow-none text-accent",
      },
    },
  },
  input: { slots: { field: `${CARD} placeholder:text-foreground-muted/70 hover:border-border-strong focus:border-accent focus:ring-accent/25` } },
  select: {
    slots: {
      trigger: `${CARD} hover:border-border-strong focus:border-accent focus:ring-accent/25`,
      panel: `${FROST} shadow-modal`,
      optionActive: "bg-white/10",
      optionSelected: "text-foreground",
    },
  },
  switch: {
    slots: { track: "bg-white/10" },
    variants: { checked: { true: { track: "bg-accent shadow-[0_0_12px_rgb(139_140_248/0.6)]" } } },
  },
  badge: {
    variants: {
      variant: {
        neutral: "border-(length:--ui-border-width) border-border bg-white/5 text-foreground",
        primary: "border-(length:--ui-border-width) border-accent/30 bg-accent/15 text-accent",
      },
    },
  },
  card: {
    variants: {
      variant: {
        default: `${CARD} shadow-card`,
        outline: "border-border bg-transparent",
        elevated: "bg-white/[0.05] shadow-card",
        glass: `border-border ${FROST} shadow-card`,
      },
      interactive: { true: "hover:border-border-strong hover:translate-y-0" },
    },
  },
  modal: { slots: { panel: `border-(length:--ui-border-width) border-border ${FROST}`, close: "hover:bg-white/10" } },
  tabs: {
    variants: {
      variant: {
        underline: { triggerActive: "border-foreground text-foreground" },
        pills: { triggerActive: "bg-white/10 text-foreground hover:text-foreground" },
        enclosed: { list: "border-(length:--ui-border-width) border-border bg-white/[0.03]", triggerActive: "bg-white/10 text-foreground shadow-control" },
      },
    },
  },
  dataTable: { slots: { root: `${CARD} shadow-card`, head: "bg-white/[0.02]", row: "hover:bg-white/[0.03]", rowSelected: "bg-accent/10 hover:bg-accent/10" } },
  imageDropzone: { slots: { zone: "hover:border-border-strong", zoneActive: "border-accent bg-accent/10" } },
  form: { slots: { card: `${CARD} shadow-card`, sectionIconBox: "bg-white/5" } },
  adminSidebar: { slots: { root: "bg-white/[0.02] backdrop-blur-xl", item: "hover:bg-white/5", itemActive: "bg-white/10 text-foreground hover:bg-white/10" } },
  adminHeader: { slots: { root: "bg-white/[0.02] backdrop-blur-xl" } },
  adminShell: { slots: { root: "bg-transparent" } },
  loginForm: { slots: { root: "bg-transparent", card: `${FROST} shadow-modal border-border` } },
});

export default defineTheme({
  name: "glass",
  extends: base,
  recipes,
  icons: createLucideIcons({ strokeWidth: 1.5 }),
  fontOptions,
  fonts: [
    { family: "Inter Variable", roles: ["display", "body", "interactive"] },
    { family: "JetBrains Mono", roles: ["mono"] },
  ],
  meta: { label: "Dark Glass", description: "Deep black, mesh gradients, 1px translucent borders, restrained frost.", modes: ["dark"] },
});
