import type { HTMLAttributes, ReactNode, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { useDefaults, useStyles } from "@dem-ui/foundation";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Names the table for everyone. Prefer it to a heading next to the table. */
  caption?: ReactNode;
  /** Alternate row backgrounds. */
  isStriped?: boolean;
  /** Lines around every cell. */
  isBordered?: boolean;
  /** Highlights the row under the pointer. */
  isHoverable?: boolean;
  density?: "compact" | "normal" | "relaxed";
  wrapperClassName?: string;
}

/** A static table. With sorting, selection and row actions, see `DataTable` in functional. */
export function Table(rawProps: TableProps) {
  const { caption, isStriped = false, isBordered = false, isHoverable = false, density = "normal", wrapperClassName, className, children, ...props } = useDefaults("table", rawProps);
  const s = useStyles("table", { isStriped, isBordered, isHoverable, density });
  return (
    <div className={s("wrapper", wrapperClassName)}>
      <table className={s("root", className)} {...props}>
        {caption && <TableCaption>{caption}</TableCaption>}
        {children}
      </table>
    </div>
  );
}

export function TableCaption({ className, ...props }: HTMLAttributes<HTMLTableCaptionElement>) {
  const s = useStyles("table");
  return <caption className={s("caption", className)} {...props} />;
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  const s = useStyles("table");
  return <thead className={s("head", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  const s = useStyles("table");
  return <tbody className={s("body", className)} {...props} />;
}

export function TableFoot({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  const s = useStyles("table");
  return <tfoot className={s("foot", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  const s = useStyles("table");
  return <tr className={s("row", className)} {...props} />;
}

type CellAlign = "left" | "center" | "right";

export interface TableHeaderCellProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: CellAlign;
}

/** A `th`. `scope` defaults to `col`: pass `row` for a heading at the start of a row. */
export function TableHeaderCell({ align = "left", scope = "col", className, ...props }: TableHeaderCellProps) {
  const s = useStyles("table", { align });
  return <th scope={scope} className={s("headerCell", className)} {...props} />;
}

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: CellAlign;
}

export function TableCell({ align = "left", className, ...props }: TableCellProps) {
  const s = useStyles("table", { align });
  return <td className={s("cell", className)} {...props} />;
}
