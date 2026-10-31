import type { AnchorHTMLAttributes, ReactNode, Ref } from "react";
import { Icon, useDefaults, useStyles, useUI } from "@dem-ui/foundation";
import type { TextSize } from "./typography";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: ReactNode;
  variant?: "default" | "muted" | "inherit";
  /** `hover` shows the line only on hover. */
  underline?: "always" | "hover" | "none";
  size?: TextSize;
  /** Opens a new tab, safely, skipping the router. */
  isExternal?: boolean;
  /** Adds the arrow that tells the reader it leaves the site. */
  showExternalIcon?: boolean;
  ref?: Ref<HTMLAnchorElement>;
}

/** A text link through the provider's router. For a link that looks like a button, use `Button href`. */
export function Link(rawProps: LinkProps) {
  const { variant = "default", underline = "always", size, isExternal = false, showExternalIcon = false, className, children, ...props } = useDefaults("link", rawProps);
  const { Link: RouterLink } = useUI();
  const s = useStyles("link", { variant, underline, size });
  const content = (
    <>
      {children}
      {isExternal && showExternalIcon && <Icon name="arrowRight" className={s("icon")} />}
    </>
  );
  if (isExternal) {
    return (
      <a target="_blank" rel="noopener noreferrer" className={s("root", className)} {...props}>
        {content}
      </a>
    );
  }
  return (
    <RouterLink className={s("root", className)} {...props}>
      {content}
    </RouterLink>
  );
}
