import type { HTMLAttributes, ReactNode } from "react";
import { useDefaults, useStyles } from "@dem-ui/foundation";
import type { Roundness } from "./Button";

export type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "danger" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant | (string & {});
  size?: "sm" | "md";
  roundness?: Roundness;
  icon?: ReactNode;
  /** A pulsing dot, for a live state. */
  ping?: boolean;
  classNames?: Partial<Record<"root" | "icon" | "ping" | "pingPulse" | "pingDot", string>>;
}

export function Badge(rawProps: BadgeProps) {
  const {
  children,
  variant = "neutral",
  size = "sm",
  roundness,
  icon,
  ping = false,
  className,
  classNames,
  ...props
} = useDefaults("badge", rawProps);
  const s = useStyles("badge", { variant, size, roundness }, classNames);
  return (
    <span className={s("root", className)} {...props}>
      {ping && (
        <span className={s("ping")} aria-hidden="true">
          <span className={s("pingPulse")} />
          <span className={s("pingDot")} />
        </span>
      )}
      {icon && <span className={s("icon")}>{icon}</span>}
      {children}
    </span>
  );
}
