import type { ElementType, HTMLAttributes, ReactNode, Ref } from "react";
import { useDefaults, useStyles, type ThemeComponent } from "@dem-ui/foundation";

export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
export type TextWeight = "light" | "normal" | "medium" | "semibold" | "bold" | "black";
export type TextAlign = "left" | "center" | "right" | "justify";

/** The look every text element shares. Each `is*` is off unless asked for. */
export interface TextStyleProps {
  size?: TextSize | (string & {});
  weight?: TextWeight;
  align?: TextAlign;
  /** Shorthand for `weight="bold"`. */
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikethrough?: boolean;
  isUppercase?: boolean;
  /** One line with an ellipsis. */
  isTruncated?: boolean;
  /** The theme's secondary text colour. */
  isMuted?: boolean;
  /** Uses the theme's monospace font. */
  isMono?: boolean;
  /** Colour classes, usually stored by the admin. */
  colorClassName?: string;
}

interface TextElementProps extends TextStyleProps, Omit<HTMLAttributes<HTMLElement>, "color"> {
  ref?: Ref<HTMLElement>;
}

function splitTextProps<P extends TextElementProps>({ size, weight, align, isBold, isItalic, isUnderline, isStrikethrough, isUppercase, isTruncated, isMuted, isMono, colorClassName, className, ...rest }: P) {
  return {
    selection: { size, weight: isBold ? "bold" : weight, align, isItalic, isUnderline, isStrikethrough, isUppercase, isTruncated, isMuted, isMono },
    colorClassName,
    className,
    rest,
  };
}

/** A text element fixed to one tag, with one recipe. */
function textElement<P extends TextElementProps>(tag: ElementType, recipe: ThemeComponent, extra?: { tagName?: string }) {
  return function TextElement(rawProps: P) {
    const { selection, colorClassName, className, rest } = splitTextProps(useDefaults(recipe, rawProps));
    const s = useStyles(recipe, { ...selection, tag: extra?.tagName });
    const Tag = tag;
    return <Tag className={s("root", colorClassName, className)} {...rest} />;
  };
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends TextElementProps {
  children?: ReactNode;
  /** The tag, h1 to h6, which also sets the default size. */
  level?: HeadingLevel;
  /** Renders another tag while looking like `level`. */
  as?: ElementType;
}

/** `level` is the document structure; `size` changes only how it looks, so the two can differ. */
export function Heading(rawProps: HeadingProps) {
  const { level = 2, as, ...props } = useDefaults("heading", rawProps);
  const { selection, colorClassName, className, rest } = splitTextProps(props);
  const s = useStyles("heading", { level: props.size ? undefined : String(level), ...selection });
  const Tag: ElementType = as ?? `h${level}`;
  return <Tag className={s("root", colorClassName, className)} {...rest} />;
}

export interface ParagraphProps extends TextElementProps {
  children?: ReactNode;
  /** Renders another tag, for instance a `div` around block content. */
  as?: ElementType;
  variant?: "default" | "muted" | "error";
  /** A loading placeholder instead of the text. */
  skeleton?: boolean;
}

export function Paragraph(rawProps: ParagraphProps) {
  const { as: Tag = "p", variant = "default", skeleton = false, ...props } = useDefaults("paragraph", rawProps);
  const { selection, colorClassName, className, rest } = splitTextProps({ size: "md", ...props });
  const s = useStyles("paragraph", { ...selection, variant });
  if (skeleton) return <div className={s("skeleton", className)} />;
  return <Tag className={s("root", colorClassName, className)} {...rest} />;
}

export interface TextProps extends TextElementProps {
  children?: ReactNode;
  /** Inline by default. */
  as?: ElementType;
}

/** Text inside other text, with no meaning of its own: a `span`. */
export function Text(rawProps: TextProps) {
  const { as: Tag = "span", ...props } = useDefaults("text", rawProps);
  const { selection, colorClassName, className, rest } = splitTextProps(props);
  const s = useStyles("text", selection);
  return <Tag className={s("root", colorClassName, className)} {...rest} />;
}

type InlineProps = TextElementProps & { children?: ReactNode };
const inline = (tag: string) => textElement<InlineProps>(tag as ElementType, "inlineText", { tagName: tag });

/** Important text. */
export const Strong = inline("strong");
/** Stressed text. */
export const Em = inline("em");
/** Side notes and fine print. */
export const Small = inline("small");
/** Highlighted text. */
export const Mark = inline("mark");
/** Text that was removed. */
export const Del = inline("del");
/** Text that was added. */
export const Ins = inline("ins");
export const Sub = inline("sub");
export const Sup = inline("sup");
/** The title of a work. */
export const Cite = inline("cite");
/** A key on the keyboard. */
export const Kbd = inline("kbd");
/** Output of a program. */
export const Samp = inline("samp");

export interface AbbrProps extends InlineProps {
  /** The full form, shown on hover. */
  title: string;
}
export const Abbr = textElement<AbbrProps>("abbr", "inlineText", { tagName: "abbr" });

export interface QProps extends InlineProps {
  /** URL of the source. */
  cite?: string;
}
/** A short quote inside a sentence: the browser adds the quote marks. */
export const Q = textElement<QProps>("q", "inlineText", { tagName: "q" });

export interface TimeProps extends InlineProps {
  /** Machine-readable date, for instance "2026-10-31". */
  dateTime?: string;
}
export const Time = textElement<TimeProps>("time", "inlineText", { tagName: "time" });

export interface CodeProps extends TextElementProps {
  children?: ReactNode;
  /** A block with its own scroll (`pre` + `code`) instead of code inside a sentence. */
  isBlock?: boolean;
  /** Shown to assistive technology and as the `data-language` attribute. */
  language?: string;
}

export function Code(rawProps: CodeProps) {
  const { isBlock = false, language, ...props } = useDefaults("code", rawProps);
  const { selection, colorClassName, className, rest } = splitTextProps(props);
  const s = useStyles("code", { ...selection, isBlock });
  if (!isBlock) return <code className={s("root", colorClassName, className)} data-language={language} {...rest} />;
  return (
    <pre className={s("root", colorClassName, className)} data-language={language}>
      <code className={s("inner")} {...rest} />
    </pre>
  );
}

export interface BlockquoteProps extends TextElementProps {
  children?: ReactNode;
  /** Who said it, shown under the quote. */
  footer?: ReactNode;
  /** URL of the source. */
  cite?: string;
}

/** A long quote set apart. For a whole content section with a large quote, see `Quote` in content. */
export function Blockquote(rawProps: BlockquoteProps) {
  const { footer, cite, children, ...props } = useDefaults("blockquote", rawProps);
  const { selection, colorClassName, className, rest } = splitTextProps(props);
  const s = useStyles("blockquote", selection);
  return (
    <blockquote cite={cite} className={s("root", colorClassName, className)} {...(rest as HTMLAttributes<HTMLQuoteElement>)}>
      {children}
      {footer && <footer className={s("footer")}>{footer}</footer>}
    </blockquote>
  );
}

/** Contact details. */
export const Address = textElement<InlineProps>("address", "address");
