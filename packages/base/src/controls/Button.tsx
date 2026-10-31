import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode, Ref } from "react";
import { useDefaults, Icon, useStyles, useUI } from "@dem-ui/foundation";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "danger"
  | "success"
  | "outline"
  | "ghost"
  | "link"
  | "glass";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";
export type Roundness = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Also accepts a variant added through the theme. */
  variant?: ButtonVariant | (string & {});
  size?: ButtonSize | (string & {});
  roundness?: Roundness;
  fullWidth?: boolean;
  isLoading?: boolean;
  /** Renders the provider's `Link` instead of a `<button>`. */
  href?: string;
  isExternalLink?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  classNames?: Partial<Record<"root" | "icon" | "spinner", string>>;
  ref?: Ref<HTMLButtonElement>;
}

export function Button(rawProps: ButtonProps) {
  const {
  variant = "primary",
  size = "md",
  roundness,
  fullWidth = false,
  isLoading = false,
  href,
  isExternalLink = false,
  icon,
  iconPosition = "left",
  type = "button",
  disabled,
  className,
  classNames,
  children,
  onClick,
  ref,
  ...props
} = useDefaults("button", rawProps);
  const { Link } = useUI();
  const s = useStyles("button", { variant, size, roundness, fullWidth }, classNames);
  const isDisabled = disabled || isLoading;

  const content = (
    <>
      {isLoading ? (
        <Icon name="spinner" className={s("spinner")} aria-hidden="true" />
      ) : (
        icon && iconPosition === "left" && <span className={s("icon")}>{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === "right" && <span className={s("icon")}>{icon}</span>}
    </>
  );

  // A disabled link has no valid HTML form, so it falls back to a disabled button.
  if (href && !isDisabled) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={s("root", className)}
        {...(isExternalLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={s("root", className)}
      {...props}
    >
      {content}
    </button>
  );
}
