import type { CSSProperties, ReactNode } from "react";
import type { ThemeToggleProps } from "@dem-ui/foundation";
import { cn } from "@dem-ui/foundation/utils";

export interface SeventiesToggleProps extends ThemeToggleProps {
  /** Side of the housing in `full`, in pixels or any CSS length. */
  size?: number | string;
  /** `full` has a housing and a label; `mini` is the bare gem, for a collapsed sidebar. */
  variant?: "full" | "mini";
  /** Small line above the mode, as printed on a piece of equipment. */
  brand?: ReactNode;
  lightLabel?: ReactNode;
  darkLabel?: ReactNode;
}

function Gem({ isOn, className }: { isOn: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden transition-all duration-300",
        isOn
          ? "dem-seventies-gem-on bg-gradient-to-br from-[#ffaa33] via-[#ff6600] to-[#993300]"
          : "dem-seventies-gem-off bg-gradient-to-br from-[#4a2300] via-[#2d1600] to-[#150b00]",
        className,
      )}
    >
      <div className="dem-seventies-lens absolute inset-0 opacity-80 mix-blend-overlay" />
      {/* The curved highlight of the plastic */}
      <div className="absolute top-[5%] right-[8%] left-[8%] h-[15%] rounded-full bg-gradient-to-b from-white/40 to-transparent blur-[0.5px]" />
      {/* The bulb */}
      <div
        className={cn(
          "h-[30%] w-[20%] rounded-full bg-white blur-[1.5px] transition-all duration-300",
          isOn ? "scale-100 opacity-90" : "scale-50 opacity-0",
        )}
      />
    </div>
  );
}

const length = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

/** The gem lights up in light mode. Ported from Typamine's sidebar toggle. */
export function SeventiesToggle({
  isDark,
  onChange,
  label,
  size = 78,
  variant = "full",
  brand,
  lightLabel = "Light mode",
  darkLabel = "Dark mode",
  className,
}: SeventiesToggleProps) {
  const isMini = variant === "mini";
  const name = label ?? (isDark ? "Switch to light mode" : "Switch to dark mode");
  const button = {
    type: "button" as const,
    role: "switch",
    "aria-checked": isDark,
    "aria-label": name,
    title: name,
    onClick: () => onChange(!isDark),
  };

  // Both layouts stay mounted to cross-fade when a sidebar collapses; `inert` keeps the hidden one out of tab order.
  const fade = (visible: boolean): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0) scale(1)" : "translateY(15px) scale(0.95)",
    pointerEvents: visible ? "auto" : "none",
    transition: visible ? "opacity 0.4s ease-in-out 0.15s, transform 0.4s ease-in-out 0.15s" : "opacity 0s, transform 0s",
  });

  return (
    <div
      className={cn("relative flex items-center justify-center", isMini ? "h-7 w-7" : "w-full", className)}
    >
      <div
        inert={isMini}
        className={cn(
          "flex w-full items-center gap-3 rounded-md border border-black/5 bg-surface-muted p-2",
          isMini && "absolute inset-0",
        )}
        style={fade(!isMini)}
      >
        <button
          {...button}
          style={{ width: length(size), height: length(size), padding: typeof size === "number" ? `${size * 0.08}px` : "8%" }}
          className="flex shrink-0 cursor-pointer items-center justify-center rounded-sm border-2 border-[#151515] bg-[#222] shadow-[inset_0_4px_4px_rgb(0_0_0/0.6),0_8px_16px_-4px_rgb(0_0_0/0.7)] transition-transform duration-100 outline-none select-none focus-visible:ring-2 focus-visible:ring-focus active:scale-95"
        >
          <Gem isOn={!isDark} className="rounded-md border border-[#111]" />
        </button>
        <div className="flex flex-1 flex-col justify-center text-left font-interactive select-none">
          {brand && (
            <span className="mb-0.5 text-[9px] leading-tight font-black tracking-widest whitespace-nowrap text-foreground uppercase">
              {brand}
            </span>
          )}
          <span className="text-[10px] font-bold tracking-wider whitespace-nowrap text-foreground-muted uppercase">
            {isDark ? darkLabel : lightLabel}
          </span>
        </div>
      </div>

      <div inert={!isMini} className="absolute inset-0 flex items-center justify-center" style={fade(isMini)}>
        <button
          {...button}
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 transition-transform duration-100 outline-none select-none focus-visible:ring-2 focus-visible:ring-focus active:scale-95"
        >
          <Gem isOn={!isDark} className="rounded-sm" />
        </button>
      </div>
    </div>
  );
}

export default SeventiesToggle;
