import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { useDefaults, useStyles } from "@dem-ui/foundation";
import type { Roundness } from "./Button";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: ElementType;
  variant?: "default" | "outline" | "elevated" | "glass" | "ghost" | (string & {});
  roundness?: Roundness;
  /** Hover feedback, for a card that is clicked. */
  interactive?: boolean;
}

export function Card(rawProps: CardProps) {
  const {
  children,
  as: Component = "div",
  variant = "default",
  roundness,
  interactive = false,
  className,
  ...props
} = useDefaults("card", rawProps);
  const s = useStyles("card", { variant, roundness, interactive });
  return (
    <Component className={s("root", className)} {...props}>
      {children}
    </Component>
  );
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  hasBorder?: boolean;
  classNames?: Partial<Record<"header" | "headerText" | "title" | "subtitle" | "actions", string>>;
}

export function CardHeader({
  children,
  title,
  subtitle,
  actions,
  hasBorder = false,
  className,
  classNames,
  ...props
}: CardHeaderProps) {
  const s = useStyles("card", { headerBorder: hasBorder }, classNames);
  return (
    <div className={s("header", className)} {...props}>
      <div className={s("headerText")}>
        {title && <h3 className={s("title")}>{title}</h3>}
        {subtitle && <p className={s("subtitle")}>{subtitle}</p>}
        {children}
      </div>
      {actions && <div className={s("actions")}>{actions}</div>}
    </div>
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const s = useStyles("card");
  return <div className={s("content", className)} {...props} />;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  hasBorder?: boolean;
}

export function CardFooter({ hasBorder = false, className, ...props }: CardFooterProps) {
  const s = useStyles("card", { footerBorder: hasBorder });
  return <div className={s("footer", className)} {...props} />;
}
