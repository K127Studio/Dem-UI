import type { CSSProperties } from "react";
import type { ThemeToggleProps } from "@dem-ui/foundation";
import { cn } from "@dem-ui/foundation/utils";

/** The look of the control. The same component, the same behaviour. */
export type ToggleMode = "skeuomorphism" | "neumorphism";

export interface SkeuomorphicToggleProps extends ThemeToggleProps {
  /** `skeuomorphism` is a physical part with depth; `neumorphism` is moulded out of the surface. */
  mode?: ToggleMode;
  /** Font size in pixels: every measure is in em, so this scales the whole control. */
  size?: number;
  /** Neumorphism only: the surface it sits on in light mode. Match the parent's background. */
  lightColor?: string;
  /** Neumorphism only: the surface it sits on in dark mode. Match the parent's background. */
  darkColor?: string;
}

const accessibleName = (isDark: boolean, label?: string) => label ?? (isDark ? "Switch to light mode" : "Switch to dark mode");

/** A sliding switch, physical or soft according to `mode`. The knob sits right in light mode. */
export function SkeuomorphicToggle({
  isDark,
  onChange,
  label,
  mode = "skeuomorphism",
  size = 4,
  lightColor = "#dbc9b1",
  darkColor = "#273345",
  className,
}: SkeuomorphicToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={accessibleName(isDark, label)}
      onClick={() => onChange(!isDark)}
      style={{ fontSize: size, "--dem-toggle-surface": isDark ? darkColor : lightColor } as CSSProperties}
      className={cn("dem-toggle dem-toggle-switch", `dem-toggle-${mode}`, !isDark && "dem-toggle-on", className)}
    />
  );
}

export interface PushButtonToggleProps extends SkeuomorphicToggleProps {
  lightAuraColor?: string;
  darkAuraColor?: string;
}

/** A round push button, for tight spaces. `lightColor` and `darkColor` are its face. */
export function PushButtonToggle({
  isDark,
  onChange,
  label,
  mode = "skeuomorphism",
  size = 4,
  lightColor = "#dbc9b1",
  darkColor = "#273345",
  lightAuraColor = "rgb(245 130 31 / 0.9)",
  darkAuraColor = "rgb(100 100 100 / 0.45)",
  className,
}: PushButtonToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={accessibleName(isDark, label)}
      onClick={() => onChange(!isDark)}
      style={
        {
          fontSize: size,
          backgroundColor: isDark ? darkColor : lightColor,
          "--aura-color": isDark ? darkAuraColor : lightAuraColor,
          transition: "transform 150ms ease, box-shadow 300ms ease, background-color 300ms ease",
        } as CSSProperties
      }
      className={cn("dem-toggle dem-toggle-push", `dem-toggle-${mode}`, !isDark && "dem-toggle-on", className)}
    />
  );
}

export default SkeuomorphicToggle;
