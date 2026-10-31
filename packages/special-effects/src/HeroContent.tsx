import type { ReactNode } from "react";
import { cn } from "@dem-ui/foundation/utils";

export interface HeroLayoutProps {
  /** Title, subtitle, buttons: nothing is imposed. */
  children?: ReactNode;
  align?: "left" | "center" | "right";
  vAlign?: "top" | "center" | "bottom";
  /** Replaces the layout of the content, to use the hero as a whole-page wrapper. */
  contentClassName?: string;
}

const ALIGN = { left: "items-start text-left", center: "items-center text-center", right: "items-end text-right" };
const V_ALIGN = { top: "justify-start", center: "justify-center", bottom: "justify-end" };

export function HeroContent({ children, align = "center", vAlign = "center", contentClassName }: HeroLayoutProps) {
  return (
    <div className={contentClassName ?? cn("relative z-10 flex w-full flex-col gap-3 p-8 sm:p-16", ALIGN[align], V_ALIGN[vAlign])}>
      {children}
    </div>
  );
}
