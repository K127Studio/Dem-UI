import type { ReactNode } from "react";
import { cn } from "@dem-ui/foundation";
import { Icon, useStyles, useUI } from "@dem-ui/foundation";

export type SortDirection = "asc" | "desc";

export interface ColumnDef<T> {
  key: string;
  header: ReactNode;
  /** Defaults to `item[key]`. */
  render?: (item: T) => ReactNode;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  className?: string;
}

type DataTableSlots =
  | "root"
  | "table"
  | "caption"
  | "head"
  | "headCell"
  | "sortButton"
  | "sortIcon"
  | "row"
  | "rowSelected"
  | "cell"
  | "checkbox"
  | "actions"
  | "empty"
  | "skeleton";

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  rowActions?: (item: T) => ReactNode;
  caption?: ReactNode;
  emptyState?: ReactNode;
  isLoading?: boolean;
  skeletonRows?: number;
  density?: "compact" | "normal" | "relaxed";
  /** Passing `selectedIds` turns on the checkboxes. */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Sorting is the caller's: the table only reports the wanted order. */
  sortKey?: string;
  sortDirection?: SortDirection;
  onSortChange?: (key: string, direction: SortDirection) => void;
  onRowClick?: (item: T) => void;
  className?: string;
  classNames?: Partial<Record<DataTableSlots, string>>;
}

const ALIGN = { left: "text-left", center: "text-center", right: "text-right" };

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  rowActions,
  caption,
  emptyState,
  isLoading = false,
  skeletonRows = 5,
  density = "normal",
  selectedIds,
  onSelectionChange,
  sortKey,
  sortDirection = "asc",
  onSortChange,
  onRowClick,
  className,
  classNames,
}: DataTableProps<T>) {
  const { labels } = useUI();
  const s = useStyles<DataTableSlots>("dataTable", { density }, classNames);
  const selectable = selectedIds !== undefined;
  const allIds = data.map(keyExtractor);
  const allSelected = selectable && allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const columnCount = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);

  const toggleRow = (id: string) =>
    onSelectionChange?.(selectedIds!.includes(id) ? selectedIds!.filter((x) => x !== id) : [...selectedIds!, id]);

  return (
    <div className={s("root", className)}>
      <table className={s("table")}>
        {caption && <caption className={s("caption")}>{caption}</caption>}
        <thead className={s("head")}>
          <tr>
            {selectable && (
              <th scope="col" className={s("headCell", "w-10")}>
                <input
                  type="checkbox"
                  aria-label={labels.selectAll}
                  checked={allSelected}
                  onChange={() => onSelectionChange?.(allSelected ? [] : allIds)}
                  className={s("checkbox")}
                />
              </th>
            )}
            {columns.map((column) => {
              const isSorted = sortKey === column.key;
              const sortIcon = !isSorted ? "sort" : sortDirection === "asc" ? "arrowUp" : "arrowDown";
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={isSorted ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
                  className={s("headCell", ALIGN[column.align ?? "left"], column.className)}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className={s("sortButton")}
                      onClick={() =>
                        onSortChange?.(column.key, isSorted && sortDirection === "asc" ? "desc" : "asc")
                      }
                    >
                      {column.header}
                      <Icon name={sortIcon} className={s("sortIcon")} aria-hidden="true" />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
            {rowActions && (
              <th scope="col" className={s("headCell", "text-right")}>
                <span className="sr-only">{labels.actions}</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: skeletonRows }, (_, row) => (
              <tr key={row} className={s("row")}>
                {Array.from({ length: columnCount }, (_, cell) => (
                  <td key={cell} className={s("cell")}>
                    <div className={s("skeleton")} />
                  </td>
                ))}
              </tr>
            ))}
          {!isLoading && !data.length && (
            <tr>
              <td colSpan={columnCount} className={s("empty")}>
                {emptyState ?? labels.noData}
              </td>
            </tr>
          )}
          {!isLoading &&
            data.map((item) => {
              const id = keyExtractor(item);
              const isSelected = selectable && selectedIds.includes(id);
              return (
                <tr
                  key={id}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  className={s("row", isSelected && s("rowSelected"), onRowClick && "cursor-pointer")}
                >
                  {selectable && (
                    <td className={s("cell")} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label={labels.selectRow}
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        className={s("checkbox")}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className={cn(s("cell"), ALIGN[column.align ?? "left"], column.className)}>
                      {column.render ? column.render(item) : String((item as Record<string, unknown>)[column.key] ?? "")}
                    </td>
                  ))}
                  {rowActions && (
                    <td className={s("cell")} onClick={(e) => e.stopPropagation()}>
                      <div className={s("actions")}>{rowActions(item)}</div>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
