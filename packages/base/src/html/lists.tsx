import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from "react";
import { useDefaults, useStyles } from "@dem-ui/foundation";
import type { TextSize } from "./typography";

export type ListMarker = "disc" | "circle" | "square" | "decimal" | "alpha" | "roman" | "none";

export interface ListProps extends Omit<HTMLAttributes<HTMLElement>, "type"> {
  /** Numbered (`ol`) instead of bulleted (`ul`). */
  isOrdered?: boolean;
  /** Defaults to `decimal` when ordered, `disc` otherwise. */
  marker?: ListMarker;
  /** Side by side, without markers. For menus and tags. */
  isInline?: boolean;
  spacing?: "none" | "sm" | "md" | "lg";
  size?: TextSize;
  /** The first number, when ordered. */
  start?: number;
  /** Counts down, when ordered. */
  isReversed?: boolean;
  /** Shortcut for `ListItem` children. */
  items?: ReactNode[];
  children?: ReactNode;
}

export function List(rawProps: ListProps) {
  const { isOrdered = false, marker, isInline = false, spacing = "sm", size, start, isReversed, items, children, className, ...props } = useDefaults("list", rawProps);
  const s = useStyles("list", { marker: isInline ? "none" : (marker ?? (isOrdered ? "decimal" : "disc")), isInline, spacing, size });
  const content = items ? items.map((item, index) => <ListItem key={index}>{item}</ListItem>) : children;
  if (isOrdered) {
    return (
      <ol start={start} reversed={isReversed} className={s("root", className)} {...props}>
        {content}
      </ol>
    );
  }
  return (
    <ul className={s("root", className)} {...props}>
      {content}
    </ul>
  );
}

export function ListItem({ className, ...props }: LiHTMLAttributes<HTMLLIElement>) {
  const s = useStyles("list");
  return <li className={s("item", className)} {...props} />;
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /** Term and description side by side, from the `sm` breakpoint. */
  isInline?: boolean;
  /** Shortcut for term and description children. */
  items?: { term: ReactNode; description: ReactNode }[];
}

/** Pairs of names and values: specifications, metadata. */
export function DescriptionList(rawProps: DescriptionListProps) {
  const { isInline = false, items, children, className, ...props } = useDefaults("descriptionList", rawProps);
  const s = useStyles("descriptionList", { isInline });
  return (
    <dl className={s("root", className)} {...props}>
      {items
        ? items.map((item, index) => (
            <div key={index} className={s("group")}>
              <DescriptionTerm>{item.term}</DescriptionTerm>
              <DescriptionDetails>{item.description}</DescriptionDetails>
            </div>
          ))
        : children}
    </dl>
  );
}

export function DescriptionTerm({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const s = useStyles("descriptionList");
  return <dt className={s("term", className)} {...props} />;
}

export function DescriptionDetails({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const s = useStyles("descriptionList");
  return <dd className={s("details", className)} {...props} />;
}
