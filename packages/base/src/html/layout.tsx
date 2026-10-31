import type { ElementType, HTMLAttributes, Ref } from "react";
import { useDefaults, useStyles } from "@dem-ui/foundation";

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  /** The tag. A `div` unless the content has a meaning of its own. */
  as?: ElementType;
  ref?: Ref<HTMLElement>;
}

/** A plain element with the theme's reach: no look of its own. */
export function Box({ as: Tag = "div", ...props }: BoxProps) {
  return <Tag {...props} />;
}

const landmark = (tag: ElementType) =>
  function Landmark(props: Omit<BoxProps, "as">) {
    return <Box as={tag} {...props} />;
  };

/** A themed part of a page, usually with a heading. */
export const Section = landmark("section");
/** Content that stands on its own: a post, a card. */
export const Article = landmark("article");
/** Content beside the main one. */
export const Aside = landmark("aside");
export const Header = landmark("header");
export const Footer = landmark("footer");
/** The main content. Once per page. */
export const Main = landmark("main");
/** A block of navigation links. Give it an `aria-label` when there are several. */
export const Nav = landmark("nav");

export interface ContainerProps extends BoxProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Side padding. On by default. */
  hasGutter?: boolean;
}

/** Centres content at a readable width. */
export function Container(rawProps: ContainerProps) {
  const { size = "xl", hasGutter = true, className, ...props } = useDefaults("container", rawProps);
  const s = useStyles("container", { size, hasGutter });
  return <Box className={s("root", className)} {...props} />;
}

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  lineStyle?: "solid" | "dashed" | "dotted";
  /** Space on both sides of the line. */
  spacing?: "none" | "sm" | "md" | "lg";
}

/** An `hr`: a change of topic. For decoration or empty space, see `Spacer` in content. */
export function Divider(rawProps: DividerProps) {
  const { orientation = "horizontal", lineStyle = "solid", spacing = "md", className, ...props } = useDefaults("divider", rawProps);
  const s = useStyles("divider", { orientation, lineStyle, spacing: `${orientation}-${spacing}` });
  return <hr aria-orientation={orientation} className={s("root", className)} {...props} />;
}
