/**
 * Every class the components use lives here, written against the theme tokens (`bg-primary`,
 * `rounded-control`), never against a fixed colour. A theme changes the values of the tokens
 * and, when the shape has to change too, adds recipes of its own.
 *
 * `slots` are the parts of a component. `variants` are its axes (variant, size, ...): a value
 * is either a string, applied to the `root` slot, or a map of slot to classes.
 */
export type VariantValue = string | Record<string, string>;

export interface ComponentTheme {
  slots: Record<string, string>;
  variants?: Record<string, Record<string, VariantValue>>;
}

const ROUNDNESS = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

const FIELD =
  "w-full rounded-control font-body border-(length:--ui-border-width) border-border bg-surface text-foreground outline-none transition-colors placeholder:text-foreground-muted hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-focus/20 disabled:cursor-not-allowed disabled:opacity-50";

const HELP = "text-xs text-foreground-muted";
const ERROR = "text-xs text-danger";

const TEXT_AXES = {
  size: {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
  },
  weight: { light: "font-light", normal: "font-normal", medium: "font-medium", semibold: "font-semibold", bold: "font-bold", black: "font-black" },
  align: { left: "text-left", center: "text-center", right: "text-right", justify: "text-justify" },
  isItalic: { true: "italic" },
  isUnderline: { true: "underline underline-offset-2" },
  isStrikethrough: { true: "line-through" },
  isUppercase: { true: "uppercase" },
  isTruncated: { true: "truncate" },
  isMuted: { true: "text-foreground-muted" },
  isMono: { true: "font-mono" },
};

const DISPLAY = "font-display [font-weight:var(--ui-heading-weight)] tracking-(--ui-heading-tracking)";

export const coreRecipes = {
  button: {
    slots: {
      root: "group inline-flex cursor-pointer items-center justify-center gap-2 rounded-control font-interactive [font-weight:var(--ui-button-weight)] tracking-(--ui-button-tracking) [text-transform:var(--ui-button-transform)] shadow-control transition-all duration-(--ui-duration) outline-none select-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
      icon: "inline-flex shrink-0",
      spinner: "h-4 w-4 shrink-0 animate-spin",
    },
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary/90",
        secondary: "bg-secondary text-on-secondary hover:bg-secondary/90",
        accent: "bg-accent text-on-accent hover:bg-accent/90",
        danger: "bg-danger text-on-danger hover:bg-danger/90",
        success: "bg-success text-on-success hover:bg-success/90",
        outline:
          "border-(length:--ui-border-width) border-border-strong text-foreground hover:bg-surface-muted",
        ghost:
          "text-foreground-muted hover:bg-surface-muted",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "border-(length:--ui-border-width) border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
      },
      size: {
        xs: "min-h-7 px-2.5 py-1 text-xs",
        sm: "min-h-(--ui-control-sm) px-3 py-1.5 text-sm",
        md: "min-h-(--ui-control-md) px-4 py-2 text-sm",
        lg: "min-h-(--ui-control-lg) px-6 py-3 text-base",
        xl: "min-h-14 px-8 py-4 text-lg",
        icon: "h-(--ui-control-md) w-(--ui-control-md) p-0",
      },
      roundness: ROUNDNESS,
      fullWidth: { true: "w-full" },
    },
  },
  label: {
    slots: {
      root: "mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground",
      icon: "h-4 w-4 text-foreground-muted",
      required: "text-danger",
    },
  },
  input: {
    slots: {
      root: "w-full",
      wrapper: "relative w-full",
      field: FIELD,
      leftIcon:
        "pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center text-foreground-muted",
      rightIcon: "absolute top-1/2 right-3 flex -translate-y-1/2 items-center text-foreground-muted",
      description: `mt-1.5 ${HELP}`,
      error: `mt-1.5 ${ERROR}`,
    },
    variants: {
      size: {
        sm: { field: "min-h-(--ui-control-sm) px-2.5 py-1.5 text-sm" },
        md: { field: "min-h-(--ui-control-md) px-3 py-2 text-sm" },
        lg: { field: "min-h-(--ui-control-lg) px-4 py-3 text-base" },
      },
      roundness: {
        none: { field: "rounded-none" },
        sm: { field: "rounded-sm" },
        md: { field: "rounded-md" },
        lg: { field: "rounded-lg" },
        full: { field: "rounded-full" },
      },
      invalid: {
        true: { field: "border-danger focus:border-danger focus:ring-danger/20" },
      },
      hasLeftIcon: { true: { field: "pl-10" } },
      hasRightIcon: { true: { field: "pr-10" } },
    },
  },
  select: {
    slots: {
      root: "",
      trigger: `${FIELD} flex cursor-pointer items-center justify-between gap-2 text-left`,
      value: "truncate",
      placeholder: "truncate text-foreground-muted",
      chevron: "h-4 w-4 shrink-0 text-foreground-muted transition-transform",
      panel:
        "fixed z-[10000] flex max-h-72 flex-col overflow-hidden rounded-control border-(length:--ui-border-width) border-border bg-surface shadow-modal",
      search:
        "w-full border-b-(length:--ui-border-width) border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none",
      list: "overflow-y-auto p-1",
      option:
        "flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 text-sm text-foreground",
      optionActive: "bg-surface-muted",
      optionSelected: "font-semibold text-primary",
      optionDisabled: "cursor-not-allowed opacity-40",
      optionIcon: "inline-flex shrink-0",
      check: "ml-auto h-4 w-4 shrink-0",
      empty: "px-2.5 py-3 text-center text-sm text-foreground-muted",
      error: `mt-1.5 ${ERROR}`,
    },
    variants: {
      size: {
        sm: { trigger: "min-h-(--ui-control-sm) px-2.5 py-1.5 text-sm" },
        md: { trigger: "min-h-(--ui-control-md) px-3 py-2 text-sm" },
        lg: { trigger: "min-h-(--ui-control-lg) px-4 py-3 text-base" },
      },
      roundness: {
        none: { trigger: "rounded-none" },
        sm: { trigger: "rounded-sm" },
        md: { trigger: "rounded-md" },
        lg: { trigger: "rounded-lg" },
        full: { trigger: "rounded-full" },
      },
      fullWidth: { true: { root: "w-full" }, false: { root: "w-fit" } },
      isOpen: { true: { chevron: "rotate-180" } },
      invalid: { true: { trigger: "border-danger" } },
    },
  },
  switch: {
    slots: {
      root: "inline-flex items-start gap-3",
      track:
        "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-border-strong transition-colors outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      thumb: "pointer-events-none inline-block rounded-full bg-surface shadow transition-transform",
      text: "flex flex-col",
      label: "text-sm font-medium text-foreground",
      description: HELP,
    },
    variants: {
      size: {
        sm: { track: "h-5 w-9", thumb: "h-4 w-4" },
        md: { track: "h-6 w-11", thumb: "h-5 w-5" },
        lg: { track: "h-7 w-14", thumb: "h-6 w-6" },
      },
      checked: {
        true: { track: "bg-primary" },
      },
      thumbOffset: {
        sm: { thumb: "translate-x-4" },
        md: { thumb: "translate-x-5" },
        lg: { thumb: "translate-x-7" },
      },
    },
  },
  badge: {
    slots: {
      root: "inline-flex w-fit items-center gap-1.5 rounded-badge font-interactive font-medium",
      icon: "inline-flex shrink-0",
      ping: "relative flex h-2 w-2",
      pingPulse: "absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60",
      pingDot: "relative inline-flex h-2 w-2 rounded-full bg-current",
    },
    variants: {
      variant: {
        neutral: "bg-surface-muted text-foreground",
        primary: "bg-primary/15 text-primary",
        success: "bg-success/15 text-success",
        warning: "bg-warning/20 text-warning",
        danger: "bg-danger/15 text-danger",
        outline: "border-(length:--ui-border-width) border-border-strong text-foreground-muted",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
      },
      roundness: ROUNDNESS,
    },
  },
  card: {
    slots: {
      root: "relative flex flex-col rounded-card text-foreground transition-all duration-(--ui-duration)",
      header: "flex items-start justify-between gap-4 p-6",
      headerText: "min-w-0 flex-1",
      title: "font-display [font-weight:var(--ui-heading-weight)] tracking-(--ui-heading-tracking) text-lg",
      subtitle: "mt-1 text-sm text-foreground-muted",
      actions: "flex shrink-0 items-center gap-2",
      content: "flex-1 p-6 not-first:pt-0",
      footer: "flex items-center gap-3 p-6 not-first:pt-0",
    },
    variants: {
      variant: {
        default: "border-(length:--ui-border-width) border-border bg-surface shadow-card",
        outline: "border-(length:--ui-border-width) border-border",
        elevated: "bg-surface shadow-card",
        glass: "border-(length:--ui-border-width) border-white/20 bg-white/40 shadow-card backdrop-blur-xl",
        ghost: "",
      },
      roundness: ROUNDNESS,
      interactive: { true: "cursor-pointer hover:-translate-y-0.5 hover:shadow-modal" },
      headerBorder: { true: { header: "border-b-(length:--ui-border-width) border-border" } },
      footerBorder: { true: { footer: "border-t-(length:--ui-border-width) border-border" } },
    },
  },
  modal: {
    slots: {
      root: "fixed inset-0 z-[9999] flex items-center justify-center",
      backdrop:
        "absolute inset-0 bg-overlay backdrop-blur-sm transition-opacity duration-(--ui-duration) starting:opacity-0",
      panel:
        "relative flex w-full flex-col overflow-hidden bg-surface text-foreground shadow-modal transition-all duration-(--ui-duration) outline-none starting:scale-95 starting:opacity-0",
      header:
        "flex shrink-0 items-center justify-between gap-4 border-b-(length:--ui-border-width) border-border p-4 sm:px-6",
      title: "font-display [font-weight:var(--ui-heading-weight)] tracking-(--ui-heading-tracking) text-lg",
      close:
        "cursor-pointer rounded-md p-2 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground",
      body: "min-h-0 flex-1 overflow-y-auto p-4 sm:p-6",
      footer:
        "flex shrink-0 items-center justify-end gap-3 border-t-(length:--ui-border-width) border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6",
    },
    variants: {
      size: {
        sm: { panel: "sm:max-w-sm" },
        md: { panel: "sm:max-w-md" },
        lg: { panel: "sm:max-w-lg" },
        xl: { panel: "sm:max-w-xl" },
        "2xl": { panel: "sm:max-w-2xl" },
        "4xl": { panel: "sm:max-w-4xl" },
        "6xl": { panel: "sm:max-w-6xl" },
        full: { panel: "sm:max-w-none" },
      },
      mobile: {
        sheet: {
          root: "p-0 sm:p-6",
          panel: "h-full sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:rounded-modal",
        },
        card: { root: "p-4 sm:p-6", panel: "max-h-[calc(100dvh-2rem)] rounded-modal sm:max-h-[calc(100dvh-3rem)]" },
      },
    },
  },
  tabs: {
    slots: {
      root: "flex",
      list: "flex",
      trigger:
        "cursor-pointer text-sm font-medium whitespace-nowrap text-foreground-muted transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50",
      triggerActive: "",
      content: "min-w-0 flex-1 outline-none",
    },
    variants: {
      orientation: {
        horizontal: { root: "flex-col gap-4", list: "flex-row overflow-x-auto overflow-y-hidden [scrollbar-width:none]" },
        vertical: { root: "flex-row gap-6", list: "shrink-0 flex-col" },
      },
      variant: {
        underline: {
          list: "gap-1 border-b-(length:--ui-border-width) border-border",
          trigger: "border-b-2 border-transparent px-3 py-2",
          triggerActive: "border-primary text-primary",
        },
        pills: {
          list: "gap-1",
          trigger: "rounded-md px-3 py-2",
          triggerActive: "bg-primary text-on-primary hover:text-on-primary",
        },
        enclosed: {
          list: "w-fit gap-1 rounded-lg bg-surface-muted p-1",
          trigger: "rounded-md px-3 py-1.5",
          triggerActive: "bg-surface text-foreground shadow-card",
        },
      },
    },
  },
  accordion: {
    slots: {
      root: "border-b-(length:--ui-border-width) border-border",
      trigger:
        "flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-focus",
      chevron: "h-4 w-4 shrink-0 text-foreground-muted transition-transform duration-(--ui-duration)",
      panel: "grid transition-[grid-template-rows] duration-(--ui-duration)",
      inner: "min-h-0 overflow-hidden",
      content: "pb-4 text-sm text-foreground-muted",
      group: "w-full",
    },
    variants: {
      isOpen: {
        true: { chevron: "rotate-180", panel: "grid-rows-[1fr]" },
        false: { panel: "grid-rows-[0fr]" },
      },
    },
  },
  confirmModal: {
    slots: {
      content: "flex items-start gap-4",
      iconBox: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
      icon: "h-5 w-5",
      question: "text-sm font-medium text-foreground",
      detail: "mt-1 text-sm text-foreground-muted",
      error: `mt-3 ${ERROR}`,
    },
    variants: {
      tone: {
        danger: { iconBox: "bg-danger/15", icon: "text-danger" },
        warning: { iconBox: "bg-warning/20", icon: "text-warning" },
        success: { iconBox: "bg-success/15", icon: "text-success" },
        info: { iconBox: "bg-primary/15", icon: "text-primary" },
      },
    },
  },
  dataTable: {
    slots: {
      root: "w-full overflow-x-auto rounded-lg border-(length:--ui-border-width) border-border",
      table: "w-full border-collapse text-left text-sm text-foreground",
      caption: "p-3 text-left text-sm text-foreground-muted",
      head: "bg-surface-muted text-xs font-semibold tracking-wide text-foreground-muted uppercase",
      headCell: "font-semibold",
      sortButton: "inline-flex cursor-pointer items-center gap-1 uppercase hover:text-foreground",
      sortIcon: "h-3.5 w-3.5",
      row: "border-t-(length:--ui-border-width) border-border transition-colors hover:bg-surface-muted",
      rowSelected: "bg-primary/10 hover:bg-primary/10",
      cell: "",
      checkbox: "h-4 w-4 cursor-pointer accent-primary",
      actions: "flex items-center justify-end gap-1",
      empty: "p-10 text-center text-foreground-muted",
      skeleton: "h-4 w-full animate-pulse rounded bg-surface-muted",
    },
    variants: {
      density: {
        compact: { headCell: "px-3 py-2", cell: "px-3 py-1.5" },
        normal: { headCell: "px-4 py-3", cell: "px-4 py-3" },
        relaxed: { headCell: "px-6 py-4", cell: "px-6 py-4" },
      },
    },
  },
  imageDropzone: {
    slots: {
      root: "w-full",
      zone: "relative flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors outline-none hover:border-border-strong focus-visible:ring-2 focus-visible:ring-focus",
      zoneActive: "border-primary bg-primary/10",
      zoneDisabled: "pointer-events-none opacity-50",
      icon: "h-8 w-8 text-foreground-muted",
      prompt: "text-sm font-medium text-foreground-muted",
      hint: HELP,
      preview: "absolute inset-0 h-full w-full object-cover",
      remove:
        "absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80",
      overlay: "absolute inset-0 z-10 flex items-center justify-center bg-black/40 text-white",
      spinner: "h-6 w-6 animate-spin",
      saved: "mt-1.5 font-mono text-xs text-foreground-muted",
      error: `mt-1.5 ${ERROR}`,
    },
  },
  listToolbar: {
    slots: {
      root: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
      start: "flex min-w-0 flex-1 flex-wrap items-center gap-3",
      end: "flex flex-wrap items-center gap-2",
      search: "w-full md:max-w-xs",
      selection: "text-sm font-medium text-foreground-muted",
    },
  },
  pagination: {
    slots: {
      pages: "flex flex-wrap items-center gap-1",
      ellipsis: "px-2 text-foreground-muted",
      root: "flex flex-col items-center justify-between gap-3 sm:flex-row",
      info: "text-sm text-foreground-muted",
      controls: "flex items-center gap-1",
    },
  },
  paragraph: {
    slots: { root: "whitespace-pre-line", skeleton: "h-4 w-full animate-pulse rounded bg-surface-muted" },
    variants: {
      ...TEXT_AXES,
      variant: { default: "", muted: "text-foreground-muted", error: "text-danger" },
    },
  },
  paragraphWithImage: {
    slots: {
      root: "relative z-0 w-full overflow-hidden",
      text: "relative z-10 w-full",
      media: "relative z-10 w-full overflow-hidden rounded-sm",
      image: "absolute inset-0 h-full w-full object-cover",
      overlay: "absolute inset-0 z-10 bg-black",
    },
    variants: {
      imagePosition: {
        left: {
          root: "grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16",
          media: "min-h-72 lg:order-1",
          text: "lg:order-2",
        },
        right: {
          root: "grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16",
          media: "min-h-72 lg:order-2",
          text: "lg:order-1",
        },
        top: { root: "flex flex-col gap-8", media: "order-1 min-h-72", text: "order-2" },
        bottom: { root: "flex flex-col gap-8", media: "order-2 min-h-72", text: "order-1" },
        background: {
          root: "flex min-h-[60vh] items-center justify-center py-24",
          media: "absolute inset-0 z-0 rounded-none",
          text: "max-w-4xl px-6 text-white",
        },
      },
      imageAspectRatio: {
        square: { media: "aspect-square" },
        video: { media: "aspect-video" },
        portrait: { media: "aspect-[3/4]" },
        wide: { media: "aspect-[21/9]" },
        auto: { media: "h-full" },
      },
    },
  },
  quote: {
    slots: {
      root: "group relative flex flex-col items-center px-6 py-16",
      inner: "mx-auto flex w-full max-w-4xl flex-col items-center",
      iconStart: "self-start text-current/20",
      iconEnd: "rotate-180 self-end text-current/20",
      text: "text-center text-3xl leading-relaxed font-bold italic whitespace-pre-line text-current/90",
      author: "mt-8 flex flex-col items-center text-center",
      name: "text-xl font-semibold",
      meta: "mt-1 text-xs font-bold tracking-widest text-current/50 uppercase",
      separator: "mx-2",
    },
  },
  markdown: {
    slots: { root: "w-full" },
    variants: {
      size: { sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-xl", "2xl": "text-2xl" },
      align: { left: "text-left", center: "text-center", right: "text-right", justify: "text-justify" },
    },
  },
  simpleHero: {
    slots: {
      root: "relative flex min-h-[70vh] w-full flex-col overflow-hidden bg-neutral-900 py-24",
      media: "absolute inset-0 z-0",
      image: "absolute inset-0 h-full w-full object-cover",
      overlay: "absolute inset-0 bg-black",
      container: "relative z-10 mx-auto flex w-full max-w-7xl px-6 md:px-12",
      content: "flex max-w-4xl flex-col",
      title: "font-display [font-weight:var(--ui-heading-weight)] tracking-(--ui-heading-tracking) text-5xl whitespace-pre-line text-white md:text-7xl",
      subtitle: "mt-6 max-w-2xl text-xl leading-relaxed whitespace-pre-line text-white/80 md:text-2xl",
      actions: "mt-8 flex flex-wrap gap-4",
    },
    variants: {
      align: {
        left: { container: "justify-start", content: "items-start text-left" },
        center: { container: "justify-center", content: "items-center text-center" },
        right: { container: "justify-end", content: "items-end text-right" },
      },
      vAlign: { top: "justify-start", center: "justify-center", bottom: "justify-end" },
    },
  },
  gridHero: {
    slots: {
      root: "flex min-h-[70vh] w-full flex-col overflow-hidden md:flex-row",
      media: "relative min-h-[50vh] w-full shrink-0 md:min-h-0 md:w-1/2",
      image: "absolute inset-0 h-full w-full object-cover",
      content: "flex w-full min-w-0 grow flex-col",
      panel: "flex min-w-0 grow flex-col justify-center px-8 py-12 md:px-12 md:py-16",
    },
    variants: {
      imagePosition: {
        left: { media: "md:order-first" },
        right: { media: "md:order-last" },
      },
      hasImage: { true: { content: "md:w-1/2" } },
    },
  },
  moduleEditor: {
    slots: {
      root: "flex flex-col gap-4",
      row: "grid grid-cols-1 gap-4 sm:grid-cols-2",
      list: "flex flex-col gap-3",
      item: "rounded-lg border-(length:--ui-border-width) border-border bg-surface",
      itemHeader:
        "flex items-center justify-between gap-2 border-b-(length:--ui-border-width) border-border px-4 py-2",
      itemTitle: "flex items-center gap-2 text-sm font-semibold text-foreground",
      itemBody: "p-4",
      add: "flex flex-wrap gap-2",
      empty: "rounded-lg border-(length:--ui-border-width) border-dashed border-border p-8 text-center text-sm text-foreground-muted",
    },
  },
  form: {
    slots: {
      formRoot: "flex flex-col gap-4",
      card: "rounded-lg border-(length:--ui-border-width) border-border bg-surface p-6 shadow-card",
      sectionHeading:
        "mb-6 flex items-center gap-4 border-b-(length:--ui-border-width) border-border pb-4",
      sectionIconBox:
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-muted text-foreground-muted",
      sectionIcon: "h-5 w-5",
      sectionTitle: "font-display [font-weight:var(--ui-heading-weight)] tracking-(--ui-heading-tracking) text-lg text-foreground",
      sectionSubtitle: "text-sm text-foreground-muted",
      groupHeading: "mb-3 text-xs font-semibold tracking-wider text-foreground-muted uppercase",
      toggleRow:
        "flex items-center justify-between gap-4 rounded-md border-(length:--ui-border-width) border-border p-4",
      toggleTitle: "text-sm font-medium text-foreground",
      toggleDescription: HELP,
      note: "rounded-md p-4 text-sm",
      actions: "flex flex-wrap items-center justify-between gap-3",
      savingOverlay:
        "fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-3 bg-overlay text-white backdrop-blur-sm",
      savingSpinner: "h-8 w-8 animate-spin",
    },
    variants: {
      noteTone: {
        info: { note: "bg-primary/10 text-primary" },
        warning: { note: "bg-warning/15 text-warning" },
        danger: { note: "bg-danger/10 text-danger" },
      },
    },
  },
  tabHeading: {
    slots: {
      root: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
      title: "font-display [font-weight:var(--ui-heading-weight)] tracking-(--ui-heading-tracking) text-3xl text-foreground",
      subtitle: "mt-1 text-sm text-foreground-muted",
      actions: "flex flex-wrap items-center gap-2",
    },
  },
  localeTabs: {
    slots: {
      root: "flex flex-wrap gap-1",
      tab: "flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-muted",
      tabActive: "bg-primary text-on-primary hover:bg-primary",
      dot: "h-1.5 w-1.5 rounded-full",
      dotDone: "bg-success",
      dotMissing: "bg-border-strong",
    },
  },
  adminShell: {
    slots: {
      root: "flex h-dvh w-full overflow-hidden bg-surface-muted text-foreground",
      main: "flex min-w-0 flex-1 flex-col",
      content: "min-h-0 flex-1 overflow-y-auto p-4 md:p-8",
      backdrop: "fixed inset-0 z-40 bg-overlay md:hidden",
    },
  },
  adminSidebar: {
    slots: {
      root: "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 -translate-x-full flex-col border-r-(length:--ui-border-width) border-border bg-surface transition-transform md:static md:translate-x-0",
      rootOpen: "translate-x-0",
      logo: "flex h-16 shrink-0 items-center border-b-(length:--ui-border-width) border-border px-5 font-semibold",
      nav: "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3",
      item: "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-muted",
      itemActive: "bg-primary text-on-primary hover:bg-primary",
      itemIcon: "h-4 w-4 shrink-0",
      footer: "shrink-0 border-t-(length:--ui-border-width) border-border p-3",
    },
  },
  adminHeader: {
    slots: {
      root: "flex h-16 shrink-0 items-center justify-between gap-4 border-b-(length:--ui-border-width) border-border bg-surface px-4 md:px-8",
      start: "flex min-w-0 items-center gap-3",
      title: "font-display [font-weight:var(--ui-heading-weight)] tracking-(--ui-heading-tracking) truncate text-lg",
      end: "flex shrink-0 items-center gap-3",
      menu: "md:hidden",
    },
  },
  loginForm: {
    slots: {
      root: "flex min-h-dvh w-full items-center justify-center bg-surface-muted p-4",
      card: "w-full max-w-sm rounded-lg border-(length:--ui-border-width) border-border bg-surface p-8 shadow-card",
      logo: "mb-6 flex justify-center",
      title: "font-display [font-weight:var(--ui-heading-weight)] tracking-(--ui-heading-tracking) text-center text-2xl text-foreground",
      subtitle: "mt-1 text-center text-sm text-foreground-muted",
      form: "mt-6 flex flex-col gap-4",
      error: "rounded-md bg-danger/10 p-3 text-sm text-danger",
      footer: "mt-6 text-center text-sm text-foreground-muted",
    },
  },
  comingSoon: {
    slots: {
      root: "flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border-(length:--ui-border-width) border-dashed border-border p-10 text-center",
      icon: "h-8 w-8 text-foreground-muted",
      title: "font-display [font-weight:var(--ui-heading-weight)] tracking-(--ui-heading-tracking) text-lg text-foreground",
      description: "max-w-md text-sm text-foreground-muted",
    },
  },
  spacer: {
    slots: { root: "flex w-full items-center justify-center", line: "bg-border" },
    variants: {
      height: { xs: "h-4", sm: "h-8", md: "h-16", lg: "h-24", xl: "h-32", "2xl": "h-48" },
      thickness: {
        "1": { line: "h-px" },
        "2": { line: "h-0.5" },
        "4": { line: "h-1" },
        "8": { line: "h-2" },
        "16": { line: "h-4" },
        "24": { line: "h-6" },
        "32": { line: "h-8" },
      },
    },
  },
  localeSwitch: { slots: { list: "flex flex-col gap-2" } },
  filters: {
    slots: {
      root: "flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center",
      search: "min-w-0 flex-1",
      sort: "w-full sm:w-auto sm:min-w-44",
      perPage: "w-full sm:w-24",
      count: "inline-flex h-5 min-w-5 items-center justify-center rounded-badge bg-primary px-1 text-xs text-on-primary",
      fields: "flex flex-col gap-6",
      footer: "justify-between",
      tagsLabel: "mb-1.5 text-sm font-medium text-foreground",
      tags: "flex max-h-80 flex-wrap gap-2 overflow-y-auto",
      tag: "inline-flex cursor-pointer items-center gap-1.5 rounded-badge border-(length:--ui-border-width) border-border px-3 py-1 text-xs font-medium text-foreground-muted transition-colors hover:border-border-strong",
      tagActive: "border-primary bg-primary text-on-primary hover:border-primary",
      selectionBar: "flex flex-wrap items-center justify-between gap-3",
      selectionCount: "text-sm font-semibold text-foreground",
      selectionActions: "flex flex-wrap items-center gap-2",
    },
  },
  colorPicker: {
    slots: {
      root: "w-full",
      preview: "mr-1 flex -space-x-2",
      previewDot: "h-5 w-5 rounded-full border-(length:--ui-border-width) border-border-strong",
      body: "flex flex-col gap-8",
      section: "flex flex-col gap-4",
      grid: "flex flex-wrap gap-2",
      swatch: "relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-(length:--ui-border-width) border-border text-foreground-muted transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-focus",
      swatchActive: "ring-2 ring-foreground ring-offset-2 ring-offset-surface",
      swatchCustom: "border-dashed border-border-strong focus-within:ring-2 focus-within:ring-focus",
      slider: "flex flex-col gap-1 text-sm font-medium text-foreground",
      sliderHead: "flex items-center justify-between",
      sliderValue: "font-mono text-xs text-foreground-muted",
      sliderInput: "w-full cursor-pointer accent-primary",
      stop: "flex flex-col gap-3",
      stopLabel: "text-sm font-medium text-foreground",
      gradient: "flex flex-col gap-5",
      gradientPreview: "h-16 w-full rounded-control border-(length:--ui-border-width) border-border",
      directions: "flex flex-wrap gap-1",
      direction: "h-9 w-9 cursor-pointer rounded-control border-(length:--ui-border-width) border-border text-foreground transition-colors hover:bg-surface-muted",
      directionActive: "border-primary bg-primary text-on-primary hover:bg-primary",
    },
  },
  heading: {
    slots: { root: DISPLAY },
    variants: {
      ...TEXT_AXES,
      level: {
        "1": "text-4xl md:text-5xl",
        "2": "text-3xl md:text-4xl",
        "3": "text-2xl md:text-3xl",
        "4": "text-xl md:text-2xl",
        "5": "text-lg",
        "6": "text-base",
      },
    },
  },
  text: { slots: { root: "" }, variants: TEXT_AXES },
  inlineText: {
    slots: { root: "" },
    variants: {
      ...TEXT_AXES,
      tag: {
        strong: "font-bold",
        em: "italic",
        small: "text-sm",
        mark: "rounded-sm bg-accent px-1 text-on-accent",
        del: "text-foreground-muted line-through",
        ins: "underline decoration-success underline-offset-2",
        sub: "align-sub text-[0.75em]",
        sup: "align-super text-[0.75em]",
        cite: "italic",
        kbd: "rounded-control border-(length:--ui-border-width) border-border-strong bg-surface-muted px-1.5 py-0.5 font-mono text-[0.85em] shadow-control",
        samp: "font-mono text-[0.9em]",
        abbr: "cursor-help underline decoration-dotted underline-offset-2",
        q: "italic",
        time: "",
      },
    },
  },
  code: {
    slots: { root: "font-mono text-[0.9em]", inner: "" },
    variants: {
      ...TEXT_AXES,
      isBlock: {
        true: { root: "block overflow-x-auto rounded-control bg-surface-muted p-4 whitespace-pre text-foreground", inner: "font-mono" },
        false: { root: "rounded-sm bg-surface-muted px-1.5 py-0.5" },
      },
    },
  },
  blockquote: {
    slots: {
      root: "border-l-4 border-border-strong pl-4 italic",
      footer: "mt-2 text-sm text-foreground-muted not-italic",
    },
    variants: TEXT_AXES,
  },
  address: { slots: { root: "not-italic" }, variants: TEXT_AXES },
  link: {
    slots: {
      root: "rounded-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-focus",
      icon: "ml-1 inline h-[1em] w-[1em] -rotate-45 align-[-0.125em]",
    },
    variants: {
      variant: {
        default: "text-primary hover:opacity-80",
        muted: "text-foreground-muted hover:text-foreground",
        inherit: "text-current",
      },
      underline: {
        always: "underline underline-offset-4",
        hover: "no-underline hover:underline hover:underline-offset-4",
        none: "no-underline",
      },
      size: TEXT_AXES.size,
    },
  },
  list: {
    slots: { root: "", item: "" },
    variants: {
      marker: {
        disc: "list-disc pl-6",
        circle: "list-[circle] pl-6",
        square: "list-[square] pl-6",
        decimal: "list-decimal pl-6",
        alpha: "list-[lower-alpha] pl-6",
        roman: "list-[lower-roman] pl-6",
        none: "list-none",
      },
      isInline: { true: "flex flex-wrap items-center" },
      spacing: { none: "gap-0 space-y-0", sm: "gap-1 space-y-1", md: "gap-3 space-y-2", lg: "gap-6 space-y-4" },
      size: TEXT_AXES.size,
    },
  },
  descriptionList: {
    slots: {
      root: "flex flex-col gap-3",
      group: "",
      term: "font-semibold",
      details: "text-foreground-muted",
    },
    variants: {
      isInline: { true: { group: "grid gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-4", root: "gap-2" } },
    },
  },
  image: {
    slots: { root: "block h-auto max-w-full" },
    variants: {
      aspect: {
        auto: "",
        square: "aspect-square w-full",
        video: "aspect-video w-full",
        portrait: "aspect-[3/4] w-full",
        wide: "aspect-[21/9] w-full",
      },
      fit: { cover: "object-cover", contain: "object-contain", fill: "object-fill", none: "object-none" },
      roundness: { none: "rounded-none", control: "rounded-control", card: "rounded-card", full: "rounded-full" },
    },
  },
  figure: { slots: { root: "flex flex-col gap-2", caption: "text-sm text-foreground-muted" } },
  video: { slots: { root: "" } },
  audio: { slots: { root: "block w-full" } },
  embed: { slots: { root: "" } },
  container: {
    slots: { root: "mx-auto w-full" },
    variants: {
      size: { sm: "max-w-2xl", md: "max-w-4xl", lg: "max-w-5xl", xl: "max-w-7xl", "2xl": "max-w-screen-2xl", full: "max-w-none" },
      hasGutter: { true: "px-4 sm:px-6 lg:px-8" },
    },
  },
  divider: {
    slots: { root: "border-border" },
    variants: {
      orientation: {
        horizontal: "w-full border-0 border-t-(length:--ui-border-width)",
        vertical: "inline-block h-auto self-stretch border-0 border-l-(length:--ui-border-width)",
      },
      lineStyle: { solid: "border-solid", dashed: "border-dashed", dotted: "border-dotted" },
      spacing: {
        "horizontal-none": "",
        "horizontal-sm": "my-2",
        "horizontal-md": "my-6",
        "horizontal-lg": "my-12",
        "vertical-none": "",
        "vertical-sm": "mx-2",
        "vertical-md": "mx-4",
        "vertical-lg": "mx-8",
      },
    },
  },
  table: {
    slots: {
      wrapper: "w-full overflow-x-auto",
      root: "w-full border-collapse text-left text-sm",
      caption: "mb-2 text-left text-sm text-foreground-muted caption-top",
      head: "border-b-(length:--ui-border-width) border-border-strong",
      body: "",
      foot: "border-t-(length:--ui-border-width) border-border-strong font-semibold",
      row: "border-b-(length:--ui-border-width) border-border last:border-b-0",
      headerCell: "font-semibold",
      cell: "",
    },
    variants: {
      density: {
        compact: "[&_td]:px-2 [&_td]:py-1 [&_th]:px-2 [&_th]:py-1",
        normal: "[&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2",
        relaxed: "[&_td]:px-4 [&_td]:py-4 [&_th]:px-4 [&_th]:py-4",
      },
      isStriped: { true: "[&_tbody_tr:nth-child(even)]:bg-surface-muted" },
      isBordered: { true: "[&_td]:border-(length:--ui-border-width) [&_td]:border-border [&_th]:border-(length:--ui-border-width) [&_th]:border-border" },
      isHoverable: { true: "[&_tbody_tr:hover]:bg-primary/10" },
      align: {
        left: { headerCell: "text-left", cell: "text-left" },
        center: { headerCell: "text-center", cell: "text-center" },
        right: { headerCell: "text-right", cell: "text-right" },
      },
    },
  },
  fieldset: {
    slots: {
      root: "m-0 min-w-0 border-0 p-0 disabled:opacity-60",
      legend: "mb-2 p-0 text-sm font-semibold text-foreground",
    },
  },
  choice: {
    slots: {
      root: "flex items-start gap-2",
      input: "mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50",
      text: "flex min-w-0 flex-col gap-0.5",
      label: "cursor-pointer text-sm font-medium text-foreground",
      description: "text-xs text-foreground-muted",
      error: "text-xs text-danger",
    },
    variants: {
      invalid: { true: { input: "outline-2 outline-offset-1 outline-danger" } },
      kind: { checkbox: {}, radio: {} },
    },
  },
  radioGroup: {
    slots: { options: "flex flex-col gap-2", error: "mt-2 text-xs text-danger" },
    variants: { isInline: { true: { options: "flex-row flex-wrap gap-4" } } },
  },
  nativeSelect: {
    slots: {
      root: "w-full",
      wrapper: "relative w-full",
      field: `${FIELD} cursor-pointer appearance-none pr-9`,
      chevron: "pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-foreground-muted",
      messages: "mt-1.5 flex flex-col gap-0.5",
    },
    variants: {
      size: {
        sm: { field: "min-h-(--ui-control-sm) px-2.5 py-1.5 text-sm" },
        md: { field: "min-h-(--ui-control-md) px-3 py-2 text-sm" },
        lg: { field: "min-h-(--ui-control-lg) px-4 py-3 text-base" },
      },
      invalid: { true: { field: "border-danger" } },
    },
  },
  range: {
    slots: {
      root: "flex w-full flex-col gap-1 text-sm font-medium text-foreground",
      head: "flex items-center justify-between gap-2",
      value: "font-mono text-xs text-foreground-muted",
      input: "w-full cursor-pointer accent-primary disabled:cursor-not-allowed",
    },
  },
  progress: {
    slots: {
      root: "flex w-full flex-col gap-1 text-sm font-medium text-foreground",
      head: "flex items-center justify-between gap-2",
      value: "font-mono text-xs text-foreground-muted",
      bar: "h-2 w-full accent-primary",
    },
  },
  meter: { slots: { root: "" } },
  details: {
    slots: {
      root: "group/details rounded-control border-(length:--ui-border-width) border-border text-foreground",
      summary: "flex cursor-pointer list-none items-center justify-between gap-3 p-3 font-medium outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset [&::-webkit-details-marker]:hidden",
      chevron: "h-4 w-4 shrink-0 text-foreground-muted transition-transform group-open/details:rotate-180",
      content: "border-t-(length:--ui-border-width) border-border p-3 text-sm",
    },
  },
} satisfies Record<string, ComponentTheme>;

export type ThemeComponent = keyof typeof coreRecipes;
export type RecipeSet = Record<ThemeComponent, ComponentTheme>;
