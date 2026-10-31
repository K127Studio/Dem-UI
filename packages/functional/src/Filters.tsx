import { useEffect, useState, type ReactNode } from "react";
import { Button, type ButtonProps } from "@dem-ui/base";
import { Input } from "@dem-ui/base";
import { Modal } from "./Modal";
import { Select, type SelectOption } from "@dem-ui/base";
import { Switch } from "@dem-ui/base";
import { Icon, useStyles, useUI } from "@dem-ui/foundation";

export interface FilterButtonProps extends Omit<ButtonProps, "children"> {
  /** Shown as a count on the button. */
  activeCount?: number;
  label?: ReactNode;
}

export function FilterButton({ activeCount = 0, label, ...props }: FilterButtonProps) {
  const { labels } = useUI();
  const s = useStyles("filters");
  return (
    <Button variant="outline" icon={<Icon name="filter" className="h-4 w-4" />} {...props}>
      {label ?? labels.filters}
      {activeCount > 0 && <span className={s("count")}>{activeCount}</span>}
    </Button>
  );
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  title?: ReactNode;
  applyLabel?: ReactNode;
  clearLabel?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  children: ReactNode;
}

export function FilterModal({ isOpen, onClose, onApply, onClear, title, applyLabel, clearLabel, size = "xl", children }: FilterModalProps) {
  const { labels } = useUI();
  const s = useStyles("filters");
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <Modal.Header>{title ?? labels.filters}</Modal.Header>
      <Modal.Body>
        <div className={s("fields")}>{children}</div>
      </Modal.Body>
      <Modal.Footer className={s("footer")}>
        <Button variant="ghost" onClick={onClear}>
          {clearLabel ?? labels.clearAll}
        </Button>
        <Button onClick={onApply}>{applyLabel ?? labels.applyFilters}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export type FilterField =
  /** The first option is the "no filter" state. */
  | { type: "select"; key: string; label: ReactNode; options: SelectOption[] }
  | { type: "multiselect"; key: string; label: ReactNode; options: SelectOption[]; placeholder?: string }
  | { type: "tags"; key: string; label: ReactNode; options: SelectOption[] }
  | { type: "toggle"; key: string; label: ReactNode; description?: ReactNode };

export type FilterValue = string | string[] | boolean;
export type FilterValues = Record<string, FilterValue | undefined>;

export function countActiveFilters(fields: FilterField[], values: FilterValues) {
  return fields.reduce((count, field) => {
    const value = values[field.key];
    if (field.type === "select") return count + (value && value !== field.options[0]?.value ? 1 : 0);
    if (field.type === "toggle") return count + (value ? 1 : 0);
    return count + (Array.isArray(value) ? value.length : 0);
  }, 0);
}

function FilterFieldControl({ field, value, onChange }: { field: FilterField; value: FilterValue | undefined; onChange: (value: FilterValue) => void }) {
  const s = useStyles("filters");
  if (field.type === "select") {
    return <Select label={field.label} options={field.options} value={(value as string) || field.options[0]?.value || ""} onChange={onChange} />;
  }
  if (field.type === "multiselect") {
    return <Select multiple label={field.label} placeholder={field.placeholder} options={field.options} value={(value as string[]) ?? []} onChange={onChange} />;
  }
  if (field.type === "toggle") {
    return <Switch label={field.label} description={field.description} checked={Boolean(value)} onChange={onChange} />;
  }
  const selected = (value as string[]) ?? [];
  return (
    <div>
      <div className={s("tagsLabel")}>{field.label}</div>
      <div className={s("tags")}>
        {field.options.map((option) => {
          const isOn = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isOn}
              onClick={() => onChange(isOn ? selected.filter((v) => v !== option.value) : [...selected, option.value])}
              className={s("tag", isOn && s("tagActive"))}
            >
              {isOn && <Icon name="check" className="h-3 w-3" />}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface SearchSortFilterProps {
  /** Omit to hide the search. */
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Milliseconds after typing before reporting: a change usually hits the URL and the database. */
  searchDebounce?: number;
  sortOptions?: SelectOption[];
  sort?: string;
  onSortChange?: (value: string) => void;
  /** What the filter dialog offers. Without fields there is no filter button. */
  filters?: FilterField[];
  filterValues?: FilterValues;
  /** Called once, when the dialog is applied or cleared, not on each change in it. */
  onFiltersChange?: (values: FilterValues) => void;
  filtersTitle?: ReactNode;
  /** More controls before the filter button. */
  children?: ReactNode;
  className?: string;
  classNames?: Partial<Record<"root" | "search" | "sort", string>>;
}

/**
 * Search, sort and filter for a public list. All controlled: reading and writing the URL is the
 * project's, as its router is.
 */
export function SearchSortFilter({
  search,
  onSearchChange,
  searchPlaceholder,
  searchDebounce = 350,
  sortOptions = [],
  sort,
  onSortChange,
  filters = [],
  filterValues = {},
  onFiltersChange,
  filtersTitle,
  children,
  className,
  classNames,
}: SearchSortFilterProps) {
  const { labels } = useUI();
  const s = useStyles("filters", {}, classNames);
  const [draftSearch, setDraftSearch] = useState(search ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<FilterValues>(filterValues);

  useEffect(() => setDraftSearch(search ?? ""), [search]);

  useEffect(() => {
    if (draftSearch === (search ?? "")) return;
    const timer = setTimeout(() => onSearchChange?.(draftSearch), searchDebounce);
    return () => clearTimeout(timer);
    // Only a new draft restarts the wait.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftSearch, searchDebounce]);

  const close = () => setIsOpen(false);

  return (
    <div className={s("root", className)}>
      {search !== undefined && (
        <div className={s("search")}>
          <Input
            type="search"
            value={draftSearch}
            placeholder={searchPlaceholder ?? labels.searchPlaceholder}
            aria-label={searchPlaceholder ?? labels.searchPlaceholder}
            leftIcon={<Icon name="search" className="h-4 w-4" />}
            onChange={setDraftSearch}
          />
        </div>
      )}
      {sortOptions.length > 0 && (
        <div className={s("sort")}>
          <Select options={sortOptions} value={sort ?? sortOptions[0].value} onChange={(value) => onSortChange?.(value)} />
        </div>
      )}
      {children}
      {filters.length > 0 && (
        <>
          <FilterButton
            activeCount={countActiveFilters(filters, filterValues)}
            label={filtersTitle}
            onClick={() => {
              setDraft(filterValues);
              setIsOpen(true);
            }}
          />
          <FilterModal
            isOpen={isOpen}
            onClose={close}
            title={filtersTitle}
            onApply={() => {
              onFiltersChange?.(draft);
              close();
            }}
            onClear={() => {
              onFiltersChange?.({});
              close();
            }}
          >
            {filters.map((field) => (
              <FilterFieldControl
                key={field.key}
                field={field}
                value={draft[field.key]}
                onChange={(value) => setDraft((current) => ({ ...current, [field.key]: value }))}
              />
            ))}
          </FilterModal>
        </>
      )}
    </div>
  );
}

export interface AdminListToolbarProps extends SearchSortFilterProps {
  /** Rows per page. Omit `perPageOptions` to hide it. */
  perPageOptions?: SelectOption[];
  perPage?: string;
  onPerPageChange?: (value: string) => void;
  /** Turns the toolbar into the bulk actions bar. */
  isSelectionMode?: boolean;
  onToggleSelectionMode?: () => void;
  selectedCount?: number;
  massActions?: { label: ReactNode; onClick: () => void; variant?: ButtonProps["variant"] }[];
  selectLabel?: ReactNode;
  /** The main action, such as "New". */
  actions?: ReactNode;
}

/** `SearchSortFilter` plus what an admin table needs: page size, selection and bulk actions. */
export function AdminListToolbar({
  perPageOptions,
  perPage,
  onPerPageChange,
  isSelectionMode = false,
  onToggleSelectionMode,
  selectedCount = 0,
  massActions = [],
  selectLabel,
  actions,
  children,
  className,
  ...searchSortFilter
}: AdminListToolbarProps) {
  const { labels } = useUI();
  const s = useStyles("filters");

  if (isSelectionMode) {
    return (
      <div className={s("selectionBar", className)}>
        <span className={s("selectionCount")}>
          {selectedCount} {labels.selected}
        </span>
        <div className={s("selectionActions")}>
          {massActions.map((action, index) => (
            <Button key={index} variant={action.variant ?? "secondary"} disabled={selectedCount === 0} onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
          <Button variant="outline" onClick={onToggleSelectionMode}>
            {labels.cancel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SearchSortFilter {...searchSortFilter} className={className}>
      {perPageOptions && (
        <div className={s("perPage")}>
          <Select
            aria-label={labels.perPage}
            options={perPageOptions}
            value={perPage ?? perPageOptions[0].value}
            onChange={(value) => onPerPageChange?.(value)}
          />
        </div>
      )}
      {children}
      {onToggleSelectionMode && (
        <Button variant="outline" onClick={onToggleSelectionMode}>
          {selectLabel ?? labels.selectItems}
        </Button>
      )}
      {actions}
    </SearchSortFilter>
  );
}
