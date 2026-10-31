import { createRecipes, defineTheme } from "@dem-ui/foundation";
import { createLucideIcons } from "@dem-ui/icons-lucide";
import base from "@dem-ui/theme-base";
import { fontOptions } from "./fontOptions";

const INK = "border-(length:--ui-border-width) border-black";
// The button drops into its own shadow when hovered and pressed.
const PRESS =
  "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:scale-100 active:shadow-none";

const recipes = createRecipes({
  button: {
    slots: { root: `${INK} ${PRESS}` },
    variants: {
      variant: {
        primary: "hover:bg-primary",
        secondary: "hover:bg-secondary",
        accent: "hover:bg-accent",
        danger: "hover:bg-danger",
        success: "hover:bg-success",
        outline: "bg-surface text-foreground hover:bg-surface",
        ghost: "border-transparent bg-transparent shadow-none hover:border-black hover:bg-surface hover:shadow-none hover:translate-x-0 hover:translate-y-0",
        link: "text-foreground border-transparent shadow-none underline decoration-[3px] underline-offset-4 hover:translate-x-0 hover:translate-y-0 hover:shadow-none",
      },
    },
  },
  input: { slots: { field: `${INK} shadow-control focus:shadow-[6px_6px_0_#000] focus:ring-0 hover:border-black focus:border-black` } },
  select: {
    slots: {
      trigger: `${INK} shadow-control hover:border-black focus:border-black focus:ring-0`,
      panel: `${INK} shadow-card`,
      optionActive: "bg-primary text-on-primary",
      optionSelected: "font-bold text-foreground",
      search: "border-b-(length:--ui-border-width) border-black",
    },
  },
  switch: {
    slots: { track: `${INK} rounded-none bg-surface box-content`, thumb: "rounded-none bg-black shadow-none" },
    variants: { checked: { true: { track: "bg-secondary" } } },
  },
  badge: { slots: { root: `${INK} font-bold uppercase` } },
  card: {
    variants: {
      variant: {
        default: `${INK} bg-surface shadow-card`,
        outline: `${INK} bg-surface`,
        elevated: `${INK} bg-accent text-on-accent shadow-card`,
        glass: `${INK} bg-surface shadow-card backdrop-blur-none`,
      },
      headerBorder: { true: { header: "border-black" } },
      footerBorder: { true: { footer: "border-black" } },
    },
  },
  modal: {
    slots: {
      panel: `${INK}`,
      header: "border-black bg-primary text-on-primary",
      footer: "border-black",
      close: `${INK} rounded-none bg-surface text-foreground hover:bg-danger hover:text-on-danger`,
    },
  },
  tabs: {
    variants: {
      variant: {
        underline: { list: "border-black", trigger: "font-bold", triggerActive: "border-black bg-primary text-on-primary" },
        pills: { trigger: "border-(length:--ui-border-width) border-transparent font-bold", triggerActive: "border-black shadow-control" },
        enclosed: { list: `${INK} rounded-none bg-surface`, trigger: "rounded-none", triggerActive: "bg-accent text-on-accent shadow-none" },
      },
    },
  },
  accordion: {
    slots: { root: `${INK} mb-3 bg-surface shadow-control`, trigger: "px-4 font-bold", content: "px-4 text-foreground" },
  },
  dataTable: {
    slots: {
      root: `${INK} rounded-none shadow-card`,
      head: "bg-primary text-on-primary",
      row: "border-black hover:bg-surface-muted",
      rowSelected: "bg-secondary hover:bg-secondary",
    },
  },
  imageDropzone: { slots: { zone: "rounded-none border-black", zoneActive: "bg-primary" } },
  quote: { slots: { root: `${INK} shadow-card`, iconStart: "text-current", iconEnd: "text-current" } },
  form: { slots: { card: `${INK} rounded-none shadow-card`, toggleRow: `${INK} rounded-none`, note: `${INK} rounded-none`, sectionIconBox: `${INK} rounded-none bg-accent text-on-accent` } },
  simpleHero: { slots: { title: "uppercase" } },
  adminSidebar: { slots: { root: "border-black", logo: "border-black bg-primary text-on-primary", item: "rounded-none font-bold", itemActive: `${INK} bg-accent text-on-accent shadow-control hover:bg-accent` } },
  adminHeader: { slots: { root: "border-black" } },
  loginForm: { slots: { card: `${INK} rounded-none shadow-modal` } },
});

export default defineTheme({
  name: "neobrutalism",
  extends: base,
  recipes,
  icons: createLucideIcons({ strokeWidth: 3, strokeLinecap: "square", strokeLinejoin: "miter" }),
  fontOptions,
  fonts: [
    { family: "Space Grotesk", roles: ["display", "body"] },
    { family: "Space Mono", roles: ["interactive", "mono"] },
  ],
  meta: { label: "Neobrutalism", description: "Thick black borders, hard shadows, acid colours, buttons that press.", modes: ["light", "dark"] },
});
