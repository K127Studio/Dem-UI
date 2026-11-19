// Generated from styles/tokens.json by scripts/generate-tokens.mjs. Do not edit.

export const colorTokens = [
  "background",
  "surface",
  "surface-muted",
  "foreground",
  "foreground-muted",
  "border",
  "border-strong",
  "focus",
  "overlay",
  "primary",
  "on-primary",
  "secondary",
  "on-secondary",
  "accent",
  "on-accent",
  "danger",
  "on-danger",
  "success",
  "on-success",
  "warning",
  "on-warning",
] as const;

export const otherTokens = [
  "radius-control",
  "radius-card",
  "radius-modal",
  "radius-badge",
  "shadow-control",
  "shadow-card",
  "shadow-modal",
  "font-display",
  "font-body",
  "font-interactive",
  "font-mono",
  "heading-weight",
  "heading-tracking",
  "button-weight",
  "button-tracking",
  "button-transform",
  "border-width",
  "control-sm",
  "control-md",
  "control-lg",
  "duration",
  "ease",
] as const;

/** A token name without the `--ui-` prefix. */
export type TokenName = (typeof colorTokens)[number] | (typeof otherTokens)[number];

/** Token values by name, without the prefix: `{ primary: "#924044", "radius-control": "4px" }`. */
export type Tokens = Partial<Record<TokenName, string>>;
