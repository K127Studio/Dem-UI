import { useEffect, useState, type ReactNode } from "react";
import { Button, type ButtonVariant } from "@dem-ui/base";
import { Input } from "@dem-ui/base";
import { Select, type SelectOption } from "@dem-ui/base";
import { Icon, useStyles, useUI } from "@dem-ui/foundation";

export interface MassAction {
  label: ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
}

export interface ListToolbarProps {
  /** Omit to hide the search. It says nothing about the URL: syncing is the caller's. */
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Milliseconds to wait after typing before reporting the search. */
  searchDebounce?: number;
  sortOptions?: SelectOption[];
  sort?: string;
  onSortChange?: (value: string) => void;
  selectedCount?: number;
  massActions?: MassAction[];
  /** Extra filters, next to the search. */
  children?: ReactNode;
  /** Right side: view switch, "New" button and the like. */
  actions?: ReactNode;
  className?: string;
  classNames?: Partial<Record<"root" | "start" | "end" | "search" | "selection", string>>;
}

export function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  searchDebounce = 0,
  sortOptions,
  sort = "",
  onSortChange,
  selectedCount = 0,
  massActions = [],
  children,
  actions,
  className,
  classNames,
}: ListToolbarProps) {
  const { labels } = useUI();
  const s = useStyles("listToolbar", {}, classNames);
  const [draft, setDraft] = useState(search ?? "");

  useEffect(() => setDraft(search ?? ""), [search]);

  useEffect(() => {
    if (!searchDebounce || draft === (search ?? "")) return;
    const timer = setTimeout(() => onSearchChange?.(draft), searchDebounce);
    return () => clearTimeout(timer);
    // Only a new draft restarts the wait.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, searchDebounce]);

  return (
    <div className={s("root", className)}>
      <div className={s("start")}>
        {search !== undefined && (
          <div className={s("search")}>
            <Input
              type="search"
              value={draft}
              placeholder={searchPlaceholder ?? labels.searchPlaceholder}
              aria-label={searchPlaceholder ?? labels.searchPlaceholder}
              leftIcon={<Icon name="search" className="h-4 w-4" aria-hidden="true" />}
              onChange={(value) => {
                setDraft(value);
                if (!searchDebounce) onSearchChange?.(value);
              }}
            />
          </div>
        )}
        {children}
        {sortOptions && (
          <Select fullWidth={false} className="min-w-44" options={sortOptions} value={sort} onChange={(v) => onSortChange?.(v)} />
        )}
      </div>
      <div className={s("end")}>
        {selectedCount > 0 && (
          <>
            <span className={s("selection")}>
              {selectedCount} {labels.selected}
            </span>
            {massActions.map((action, index) => (
              <Button key={index} size="sm" variant={action.variant ?? "outline"} onClick={action.onClick}>
                {action.label}
              </Button>
            ))}
          </>
        )}
        {actions}
      </div>
    </div>
  );
}

export interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
  /** Pages in all. Or pass `totalCount` and `perPage` to have it worked out. */
  pageCount?: number;
  totalCount?: number;
  perPage?: number;
  /** `simple` for arrows, `summary` for admin tables ("Showing 1 to 10 of 42"), `numbered` for public lists. */
  variant?: "simple" | "summary" | "numbered";
  /** Word after the total: "fonts". */
  entityName?: ReactNode;
  /** Replaces the text. */
  info?: ReactNode;
  /** A single page has nothing to navigate. */
  hideOnSinglePage?: boolean;
  /** Pages shown on each side of the current one, in `numbered`. */
  siblings?: number;
  className?: string;
  classNames?: Partial<Record<"root" | "info" | "controls" | "pages" | "ellipsis", string>>;
}

function pageWindow(page: number, pageCount: number, siblings: number): (number | "gap")[] {
  const wanted = new Set([1, pageCount]);
  for (let n = page - siblings; n <= page + siblings; n++) if (n >= 1 && n <= pageCount) wanted.add(n);
  const sorted = [...wanted].sort((a, b) => a - b);
  return sorted.flatMap((n, index) => (index > 0 && n - sorted[index - 1] > 1 ? (["gap", n] as const) : [n]));
}

export function Pagination({
  page,
  onPageChange,
  pageCount,
  totalCount,
  perPage = 10,
  variant = "simple",
  entityName,
  info,
  hideOnSinglePage = false,
  siblings = 1,
  className,
  classNames,
}: PaginationProps) {
  const { labels } = useUI();
  const s = useStyles("pagination", {}, classNames);
  const pages = Math.max(1, pageCount ?? Math.ceil((totalCount ?? 0) / perPage));
  if (hideOnSinglePage && pages <= 1) return null;

  const arrow = (target: number, label: string, name: "chevronLeft" | "chevronRight", disabled: boolean) => (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      disabled={disabled}
      onClick={() => onPageChange(target)}
      icon={<Icon name={name} className="h-4 w-4" />}
    />
  );

  const summary =
    variant === "summary" && totalCount !== undefined
      ? `${labels.showing} ${totalCount === 0 ? 0 : (page - 1) * perPage + 1} ${labels.to} ${Math.min(page * perPage, totalCount)} ${labels.of} ${totalCount}`
      : null;

  return (
    <nav className={s("root", className)} aria-label="Pagination">
      <span className={s("info")}>
        {info ??
          (summary ? (
            <>
              {summary} {entityName ?? labels.items}
            </>
          ) : (
            variant !== "numbered" && `${labels.page} ${page} ${labels.of} ${pages}`
          ))}
      </span>
      <div className={s("controls")}>
        {arrow(page - 1, labels.previous, "chevronLeft", page <= 1)}
        {variant === "numbered" && (
          <div className={s("pages")}>
            {pageWindow(page, pages, siblings).map((entry, index) =>
              entry === "gap" ? (
                <span key={`gap-${index}`} className={s("ellipsis")} aria-hidden="true">
                  &hellip;
                </span>
              ) : (
                <Button
                  key={entry}
                  size="icon"
                  variant={entry === page ? "primary" : "ghost"}
                  aria-current={entry === page ? "page" : undefined}
                  onClick={() => onPageChange(entry)}
                >
                  {entry}
                </Button>
              ),
            )}
          </div>
        )}
        {arrow(page + 1, labels.next, "chevronRight", page >= pages)}
      </div>
    </nav>
  );
}
