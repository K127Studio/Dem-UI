// Starts with "use client" so that components (icons, a router Link) can cross from the
// server layout to the provider. A config of plain strings would not need it.
"use client";
import { defineConfig } from "@dem-ui/next";
import neobrutalism from "@dem-ui/theme-neobrutalism";

export default defineConfig({
  theme: neobrutalism,
  recipes: {
    badge: { slots: { root: "uppercase tracking-widest" } },
  },
  defaults: {
    card: { variant: "outline" },
  },
});
