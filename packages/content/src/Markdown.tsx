import { useStyles } from "@dem-ui/foundation";
import { renderMarkdown, type MarkdownClasses } from "@dem-ui/foundation/utils";

export interface MarkdownProps {
  content?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  align?: "left" | "center" | "right" | "justify";
  colorClassName?: string;
  /** Classes per generated element, see `MARKDOWN_CLASSES`. */
  classes?: Partial<MarkdownClasses>;
  className?: string;
}

// renderMarkdown escapes any HTML in the source and neutralises unsafe URLs,
// so its output is safe to inject.
export function Markdown({ content = "", size = "md", align = "left", colorClassName, classes, className }: MarkdownProps) {
  const s = useStyles("markdown", { size, align });
  return (
    <div
      className={s("root", colorClassName, className)}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content, classes ? { classes } : undefined) }}
    />
  );
}
