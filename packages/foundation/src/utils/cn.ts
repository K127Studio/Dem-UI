import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Without this, `rounded-none` and `rounded-control` would both survive a merge.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["control", "card", "modal", "badge"],
      shadow: ["control", "card", "modal"],
      font: ["display", "body", "interactive", "mono"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
