import { createRecipes, defineTheme } from "@dem-ui/foundation";
import { createLucideIcons } from "@dem-ui/icons-lucide";
import base from "@dem-ui/theme-base";
import { fontOptions } from "./fontOptions";

// Small caps, silk-screened on the panel.
const SILK = "text-[11px] font-medium uppercase tracking-[0.18em]";

const recipes = createRecipes({
  button: {
    slots: { root: "text-xs active:translate-y-px active:scale-100 active:shadow-none" },
    variants: {
      variant: {
        outline: "bg-surface",
        ghost: "shadow-none",
        link: "shadow-none",
      },
    },
  },
  label: { slots: { root: `${SILK} text-foreground-muted` } },
  input: { slots: { field: "bg-surface-muted shadow-[inset_0_1px_3px_rgb(0_0_0/0.3)] font-mono focus:ring-1 focus:ring-focus" } },
  select: {
    slots: {
      trigger: "bg-surface-muted shadow-[inset_0_1px_3px_rgb(0_0_0/0.3)] font-mono",
      option: "font-mono text-xs uppercase",
      optionActive: "bg-primary text-on-primary",
      optionSelected: "text-foreground",
    },
  },
  // A slide switch rather than a pill.
  switch: {
    slots: {
      track: "rounded-[3px] bg-surface-muted shadow-[inset_0_1px_3px_rgb(0_0_0/0.4)]",
      thumb: "rounded-[2px] bg-secondary shadow-control",
      label: `${SILK} text-foreground`,
    },
    variants: { checked: { true: { track: "bg-primary" } } },
  },
  // Badges read as a printed status with an LED beside them.
  badge: { slots: { root: `${SILK} font-mono`, pingDot: "shadow-[0_0_6px_currentColor]" } },
  card: {
    slots: { title: "text-sm uppercase", subtitle: `${SILK} mt-2` },
  },
  modal: { slots: { title: "text-base uppercase", header: "bg-surface-muted", footer: "bg-surface-muted" } },
  tabs: {
    slots: { trigger: SILK },
    variants: {
      variant: {
        underline: { triggerActive: "border-primary text-foreground" },
        pills: { triggerActive: "text-on-primary shadow-control" },
        enclosed: { list: "shadow-[inset_0_1px_3px_rgb(0_0_0/0.3)] rounded-[4px]", triggerActive: "bg-secondary text-on-secondary shadow-control" },
      },
    },
  },
  accordion: { slots: { trigger: SILK } },
  dataTable: { slots: { table: "font-mono text-xs", head: "text-[10px] tracking-[0.18em]" } },
  tabHeading: { slots: { title: "text-4xl uppercase", subtitle: SILK } },
  form: { slots: { sectionTitle: "text-sm uppercase", sectionSubtitle: SILK, groupHeading: SILK } },
  simpleHero: { slots: { title: "uppercase" } },
  adminSidebar: { slots: { item: SILK, itemActive: "text-on-primary shadow-control" } },
});

export default defineTheme({
  name: "industrial",
  extends: base,
  recipes,
  defaults: { input: { size: "sm" }, select: { size: "sm" }, tabs: { variant: "enclosed" } },
  icons: createLucideIcons({ strokeWidth: 1.5, strokeLinecap: "square", strokeLinejoin: "miter" }),
  fontOptions,
  fonts: [
    { family: "Doto", roles: ["display"] },
    { family: "IBM Plex Mono", roles: ["body", "interactive", "mono"] },
  ],
  meta: { label: "Industrial", description: "Anodised panels, silk-screened labels, dot-matrix headings.", modes: ["light", "dark"] },
});
