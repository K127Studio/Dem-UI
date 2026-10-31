import { createRecipes, defineTheme } from "@dem-ui/foundation";
import { createLucideIcons } from "@dem-ui/icons-lucide";
import base from "@dem-ui/theme-base";
import { fontOptions } from "./fontOptions";

const KICKER = "font-mono text-[11px] font-normal uppercase tracking-[0.2em]";
const MONUMENTAL = "text-[clamp(4rem,12vw,11rem)] leading-[0.9] md:text-[clamp(4rem,12vw,11rem)]";

const recipes = createRecipes({
  button: {
    slots: { root: "text-xs active:scale-100" },
    variants: {
      variant: {
        outline: "hover:bg-foreground hover:text-background",
        ghost: "underline-offset-4 hover:bg-transparent hover:underline",
        link: "text-foreground underline",
      },
    },
  },
  label: { slots: { root: KICKER } },
  // Fields are a rule to write on, as on a printed form.
  input: {
    slots: { field: "rounded-none border-0 border-b-(length:--ui-border-width) border-foreground bg-transparent px-0 text-lg focus:ring-0 hover:border-foreground" },
  },
  select: {
    slots: {
      trigger: "border-0 border-b-(length:--ui-border-width) border-foreground bg-transparent px-0 text-lg focus:ring-0 hover:border-foreground",
      panel: "border-(length:--ui-border-width) border-foreground",
      option: "rounded-none text-base",
      optionActive: "bg-foreground text-background",
      optionSelected: "font-normal italic text-current",
    },
  },
  switch: {
    slots: { track: "rounded-none border-(length:--ui-border-width) border-foreground bg-transparent box-content", thumb: "rounded-none bg-foreground shadow-none" },
    variants: { checked: { true: { track: "bg-transparent" } } },
  },
  badge: { slots: { root: `${KICKER} bg-transparent px-0 underline decoration-1 underline-offset-4` } },
  card: {
    slots: { title: "text-3xl", subtitle: `${KICKER} mt-2 text-foreground-muted` },
    variants: {
      variant: {
        default: "border-0 border-t-(length:--ui-border-width) border-foreground bg-transparent",
        elevated: "border-0 border-t-[6px] border-foreground bg-transparent",
        outline: "border-foreground bg-transparent",
      },
      interactive: { true: "hover:translate-y-0 hover:shadow-none hover:opacity-70" },
    },
  },
  modal: { slots: { panel: "border-(length:--ui-border-width) border-foreground bg-background", title: "text-3xl", header: "border-foreground", footer: "border-foreground" } },
  tabs: {
    slots: { trigger: KICKER },
    variants: {
      variant: {
        underline: { list: "border-foreground", triggerActive: "border-foreground text-foreground" },
        pills: { triggerActive: "bg-foreground text-background hover:text-background" },
        enclosed: { list: "rounded-none bg-transparent p-0", trigger: "rounded-none", triggerActive: "bg-transparent italic shadow-none" },
      },
    },
  },
  accordion: { slots: { root: "border-foreground", trigger: "py-6 font-display text-2xl", content: "text-base text-foreground" } },
  dataTable: {
    slots: {
      root: "rounded-none border-0 border-y-(length:--ui-border-width) border-foreground",
      table: "text-base",
      head: `bg-transparent ${KICKER}`,
      row: "border-foreground/30 hover:bg-transparent",
      rowSelected: "bg-surface-muted hover:bg-surface-muted",
    },
  },
  imageDropzone: { slots: { zone: "rounded-none border-solid border-foreground", prompt: KICKER } },
  paragraph: { variants: { size: { xl: "text-2xl", lg: "text-xl leading-relaxed" } } },
  quote: {
    slots: { text: "font-display text-5xl not-italic md:text-7xl", iconStart: "hidden", iconEnd: "hidden", name: "font-mono text-xs font-normal uppercase tracking-[0.2em]" },
  },
  simpleHero: {
    slots: { title: `${MONUMENTAL}`, subtitle: "font-display italic" },
  },
  gridHero: { slots: { panel: "border-b-(length:--ui-border-width) border-foreground" } },
  tabHeading: { slots: { root: "border-b-(length:--ui-border-width) border-foreground pb-6", title: "text-6xl md:text-8xl", subtitle: `${KICKER} mt-4` } },
  form: { slots: { card: "border-0 border-t-(length:--ui-border-width) border-foreground bg-transparent px-0", sectionHeading: "border-0", sectionIconBox: "hidden", sectionTitle: "text-4xl", sectionSubtitle: KICKER, groupHeading: KICKER, toggleRow: "rounded-none border-x-0 border-t-0 border-foreground px-0" } },
  adminSidebar: { slots: { root: "border-foreground bg-background", logo: "border-foreground font-display text-2xl italic", item: `${KICKER} rounded-none`, itemActive: "bg-foreground text-background hover:bg-foreground" } },
  adminHeader: { slots: { root: "border-foreground bg-background", title: "text-2xl" } },
  loginForm: { slots: { card: "border-foreground", title: "text-5xl", subtitle: KICKER } },
});

export default defineTheme({
  name: "editorial",
  extends: base,
  recipes,
  defaults: { card: { variant: "default" }, button: { variant: "primary" } },
  icons: createLucideIcons({ strokeWidth: 1 }),
  fontOptions,
  fonts: [
    { family: "Kugile", roles: ["display"] },
    { family: "Source Serif 4 Variable", roles: ["body"] },
    { family: "JetBrains Mono", roles: ["interactive", "mono"] },
  ],
  meta: { label: "Editorial", description: "Paper, ink, monumental serif headings, rules instead of boxes.", modes: ["light", "dark"] },
});
