import { createRecipes, defineTheme } from "@dem-ui/foundation";
import base from "@dem-ui/theme-base";
import { retroIcons } from "./icons";
import { fontOptions } from "./fontOptions";

const SUNKEN = "shadow-[inset_1px_1px_#808080,inset_-1px_-1px_#ffffff,inset_2px_2px_#0a0a0a,inset_-2px_-2px_#dfdfdf]";
const RAISED = "shadow-control";
// The title bar of a Windows 9x window.
const TITLE_BAR = "bg-gradient-to-r from-primary to-[#1084d0] text-white";

const recipes = createRecipes({
  button: {
    slots: { root: `text-lg leading-none active:scale-100 ${RAISED} active:translate-x-px active:translate-y-px` },
    variants: {
      variant: {
        primary: "bg-surface text-foreground hover:bg-surface outline-1 outline-black",
        secondary: "hover:bg-secondary",
        accent: "hover:bg-accent",
        danger: "hover:bg-danger",
        success: "hover:bg-success",
        outline: "bg-surface text-foreground hover:bg-surface",
        ghost: "shadow-none hover:bg-surface hover:shadow-control",
        link: "shadow-none text-primary underline",
        glass: "border-0 bg-surface text-foreground backdrop-blur-none hover:bg-surface",
      },
    },
  },
  label: { slots: { root: "text-lg font-normal leading-none" } },
  input: { slots: { field: `bg-white text-lg leading-none text-black ${SUNKEN} focus:ring-0 placeholder:text-neutral-500` } },
  select: {
    slots: {
      trigger: `bg-white text-lg leading-none text-black ${SUNKEN} focus:ring-0`,
      panel: "border border-black bg-white text-black",
      option: "rounded-none py-0.5 text-lg leading-none text-black",
      optionActive: "bg-primary text-on-primary",
      optionSelected: "font-normal text-current",
    },
  },
  // A checkbox-like tick box: the era had no toggle switches.
  switch: {
    slots: { track: `rounded-none bg-white ${SUNKEN}`, thumb: "rounded-none bg-[#808080] shadow-none", label: "text-lg font-normal leading-none" },
    variants: { checked: { true: { track: "bg-white" } }, },
  },
  badge: { slots: { root: `${RAISED} bg-surface text-base font-normal leading-none text-foreground` } },
  card: {
    slots: { title: "text-lg", subtitle: "text-lg text-current" },
    variants: {
      variant: {
        default: "bg-surface shadow-card",
        outline: "bg-surface shadow-card",
        elevated: "bg-surface shadow-modal",
        glass: "bg-surface shadow-card backdrop-blur-none",
        ghost: "bg-surface",
      },
      interactive: { true: "hover:translate-y-0 hover:shadow-card" },
      headerBorder: { true: { header: `border-0 ${TITLE_BAR} px-2 py-1` } },
    },
  },
  modal: {
    slots: {
      root: "",
      backdrop: "bg-transparent backdrop-blur-none",
      panel: "bg-surface p-[3px] text-foreground shadow-modal",
      header: `border-0 ${TITLE_BAR} px-1.5 py-0.5`,
      title: "text-base text-white",
      close: `rounded-none bg-surface p-0.5 text-black ${RAISED} hover:bg-surface hover:text-black`,
      body: "text-lg leading-tight",
      footer: "border-0",
    },
  },
  tabs: {
    slots: { trigger: "text-lg leading-none" },
    variants: {
      variant: {
        underline: { list: "gap-0 border-b-0", trigger: `-mb-0 rounded-none border-0 bg-surface text-foreground hover:text-foreground ${RAISED}`, triggerActive: "relative z-10 -translate-y-0.5 bg-surface" },
        pills: { trigger: `rounded-none bg-surface text-foreground ${RAISED}`, triggerActive: `bg-surface text-foreground hover:text-foreground ${SUNKEN}` },
        enclosed: { list: "rounded-none bg-surface", trigger: `rounded-none bg-surface text-foreground ${RAISED}`, triggerActive: `bg-surface shadow-none ${SUNKEN}` },
      },
    },
    },
  accordion: { slots: { root: `mb-1 border-0 bg-surface ${RAISED}`, trigger: "px-2 py-1 text-lg font-normal leading-none", content: "px-2 text-lg leading-tight text-foreground" } },
  dataTable: {
    slots: {
      root: `rounded-none bg-white text-black ${SUNKEN}`,
      table: "text-lg leading-none text-black",
      head: "bg-surface text-black normal-case",
      headCell: `font-normal ${RAISED}`,
      row: "border-0 hover:bg-primary hover:text-on-primary",
      rowSelected: "bg-primary text-on-primary hover:bg-primary",
    },
    variants: { density: { normal: { headCell: "px-2 py-1", cell: "px-2 py-0.5" } } },
  },
  imageDropzone: { slots: { zone: `rounded-none border-0 bg-white text-black ${SUNKEN}`, prompt: "text-lg font-normal text-black", hint: "text-base text-black", remove: "rounded-none" } },
  paragraph: { slots: { root: "leading-tight" } },
  quote: { slots: { root: `bg-surface shadow-card`, text: "font-body text-3xl font-normal not-italic" } },
  simpleHero: { slots: { title: "drop-shadow-[3px_3px_0_#000]", subtitle: "font-body" } },
  tabHeading: { slots: { root: `${TITLE_BAR} p-2`, title: "text-2xl text-white", subtitle: "text-lg text-white" } },
  form: { slots: { card: "bg-surface p-4 shadow-card", sectionHeading: `mb-4 border-0 ${TITLE_BAR} p-1`, sectionIconBox: "h-6 w-6 rounded-none bg-transparent text-white", sectionIcon: "h-4 w-4", sectionTitle: "text-base text-white", sectionSubtitle: "text-base leading-none text-white", toggleRow: `rounded-none border-0 ${RAISED} p-2`, toggleTitle: "text-lg font-normal leading-none", toggleDescription: "text-base leading-none text-current", note: `rounded-none text-lg leading-tight ${SUNKEN}`, groupHeading: "text-lg font-normal normal-case tracking-normal text-current" } },
  localeTabs: { slots: { tab: `rounded-none bg-surface text-lg leading-none text-foreground ${RAISED} hover:bg-surface`, tabActive: `bg-surface text-foreground hover:bg-surface ${SUNKEN}` } },
  adminSidebar: { slots: { root: "border-0 bg-surface shadow-card", logo: `${TITLE_BAR} h-8 border-0 px-2 text-base`, item: "rounded-none py-1 text-lg font-normal leading-none text-foreground hover:bg-primary hover:text-on-primary", itemActive: "bg-primary text-on-primary hover:bg-primary", footer: "border-0" } },
  adminHeader: { slots: { root: "h-10 border-0 bg-surface shadow-card", title: "text-lg" } },
  adminShell: { slots: { root: "bg-transparent", content: "p-2 md:p-4" } },
  loginForm: { slots: { root: "bg-transparent", card: "bg-surface p-3 shadow-modal", title: `${TITLE_BAR} -mx-3 -mt-3 mb-3 px-2 py-1 text-left text-base`, subtitle: "text-left text-lg text-current", footer: "text-lg text-current" } },
  comingSoon: { slots: { root: "rounded-none border-0 bg-surface shadow-card", title: "text-lg", description: "text-lg leading-tight text-current" } },
});

export default defineTheme({
  name: "retro",
  extends: base,
  recipes,
  defaults: { modal: { mobile: "card" }, input: { size: "sm" }, select: { size: "sm" } },
  icons: retroIcons,
  fontOptions,
  fonts: [
    { family: "Pixelify Sans", roles: ["display"] },
    { family: "VT323", roles: ["body", "interactive", "mono"] },
  ],
  meta: { label: "Retro Web", description: "Windows 9x bevels and title bars, bitmap fonts, dithered desktop, pixel icons.", modes: ["light", "dark"] },
});
