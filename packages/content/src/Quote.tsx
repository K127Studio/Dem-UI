import type { ReactNode } from "react";
import { Icon, useStyles } from "@dem-ui/foundation";

type QuoteSlots = "root" | "inner" | "iconStart" | "iconEnd" | "text" | "author" | "name" | "meta" | "separator";

export interface QuoteProps {
  children?: ReactNode;
  author?: ReactNode;
  authorDates?: ReactNode;
  authorInfo?: ReactNode;
  colorClassName?: string;
  bgColorClassName?: string;
  /** Set to `false` to hide the quote marks. */
  showIcons?: boolean;
  className?: string;
  classNames?: Partial<Record<QuoteSlots, string>>;
}

export function Quote({
  children,
  author,
  authorDates,
  authorInfo,
  colorClassName,
  bgColorClassName,
  showIcons = true,
  className,
  classNames,
}: QuoteProps) {
  const s = useStyles<QuoteSlots>("quote", {}, classNames);
  return (
    <figure className={s("root", colorClassName, bgColorClassName, className)}>
      <div className={s("inner")}>
        {showIcons && <Icon name="quote" className={s("iconStart")} />}
        <blockquote className={s("text")}>{children}</blockquote>
        {showIcons && <Icon name="quote" className={s("iconEnd")} />}
        {(author || authorDates || authorInfo) && (
          <figcaption className={s("author")}>
            {author && <span className={s("name")}>{author}</span>}
            {(authorDates || authorInfo) && (
              <span className={s("meta")}>
                {authorDates}
                {authorDates && authorInfo && <span className={s("separator")}>&bull;</span>}
                {authorInfo}
              </span>
            )}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
