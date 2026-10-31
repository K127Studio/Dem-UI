import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ThemedPortal, useDefaults, Icon, useStyles, useUI } from "@dem-ui/foundation";
import { Label } from "./Input";

export interface SelectOption {
  value: string;
  label: ReactNode;
  /** Text used by the search and the trigger when `label` is not a string. */
  textValue?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface OptionProps {
  value: string;
  children: ReactNode;
  textValue?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

/** Declarative alternative to the `options` array. Read by `Select`, renders nothing itself. */
export function Option(_props: OptionProps) {
  return null;
}

type SelectSlots =
  | "root"
  | "trigger"
  | "value"
  | "placeholder"
  | "chevron"
  | "panel"
  | "search"
  | "list"
  | "option"
  | "optionActive"
  | "optionSelected"
  | "optionDisabled"
  | "optionIcon"
  | "check"
  | "empty"
  | "error";

interface BaseSelectProps {
  options?: SelectOption[];
  children?: ReactNode;
  label?: ReactNode;
  placeholder?: string;
  error?: ReactNode;
  size?: "sm" | "md" | "lg";
  roundness?: "none" | "sm" | "md" | "lg" | "full";
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  /** Adds hidden inputs, for native forms and server actions. */
  name?: string;
  id?: string;
  /** Accessible name, when there is no `label`. */
  "aria-label"?: string;
  className?: string;
  classNames?: Partial<Record<SelectSlots, string>>;
  renderValue?: (selected: SelectOption[]) => ReactNode;
}

interface SingleSelectProps extends BaseSelectProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
}

interface MultiSelectProps extends BaseSelectProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
}

export type SelectProps = SingleSelectProps | MultiSelectProps;

const textOf = (o: SelectOption) => o.textValue ?? (typeof o.label === "string" ? o.label : o.value);

export function Select(rawProps: SelectProps) {
  const props = useDefaults("select", rawProps);
  const {
    options,
    children,
    label,
    placeholder,
    error,
    size = "md",
    roundness,
        fullWidth = true,
    disabled = false,
    required,
    searchable = false,
    name,
    id,
    "aria-label": ariaLabel,
    className,
    classNames,
    renderValue,
  } = props;

  const { labels } = useUI();
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listId = `${triggerId}-list`;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<{ top?: number; bottom?: number; left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const allOptions = useMemo<SelectOption[]>(() => {
    if (options) return options;
    return Children.toArray(children).flatMap((child) =>
      isValidElement<OptionProps>(child) && child.type === Option
        ? [{ ...child.props, label: child.props.children }]
        : [],
    );
  }, [options, children]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? allOptions.filter((o) => textOf(o).toLowerCase().includes(q)) : allOptions;
  }, [allOptions, query]);

  const selectedValues = props.multiple ? props.value ?? [] : props.value ? [props.value] : [];
  const selected = allOptions.filter((o) => selectedValues.includes(o.value));

  const s = useStyles<SelectSlots>("select", { size, roundness, fullWidth, isOpen, invalid: Boolean(error) }, classNames);

  // The panel sits in a portal so an overflow-hidden parent cannot clip it.
  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const openUp = window.innerHeight - rect.bottom < 240 && rect.top > window.innerHeight - rect.bottom;
    setPosition(
      openUp
        ? { bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width }
        : { top: rect.bottom + 4, left: rect.left, width: rect.width },
    );
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !panelRef.current?.contains(target)) setIsOpen(false);
    };
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [isOpen, updatePosition]);

  const open = () => {
    if (disabled) return;
    const first = allOptions.findIndex((o) => selectedValues.includes(o.value));
    setQuery("");
    setActiveIndex(Math.max(first, 0));
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const choose = (option: SelectOption | undefined) => {
    if (!option || option.disabled) return;
    if (props.multiple) {
      const next = selectedValues.includes(option.value)
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value];
      props.onChange(next);
    } else {
      props.onChange(option.value);
      close();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        open();
      }
      return;
    }
    const last = visible.length - 1;
    if (event.key === "ArrowDown") setActiveIndex((i) => (i >= last ? 0 : i + 1));
    else if (event.key === "ArrowUp") setActiveIndex((i) => (i <= 0 ? last : i - 1));
    else if (event.key === "Home") setActiveIndex(0);
    else if (event.key === "End") setActiveIndex(last);
    else if (event.key === "Enter" || (event.key === " " && !searchable)) choose(visible[activeIndex]);
    else if (event.key === "Escape") close();
    else if (event.key === "Tab") setIsOpen(false);
    else return;
    if (event.key !== "Tab") event.preventDefault();
  };

  return (
    <div className={s("root", className)}>
      {label && (
        <Label htmlFor={triggerId} required={required}>
          {label}
        </Label>
      )}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-invalid={error ? true : undefined}
        aria-activedescendant={isOpen && !searchable ? `${listId}-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={onKeyDown}
        className={s("trigger")}
      >
        {selected.length ? (
          <span className={s("value")}>{renderValue ? renderValue(selected) : selected.map(textOf).join(", ")}</span>
        ) : (
          <span className={s("placeholder")}>{placeholder ?? labels.selectPlaceholder}</span>
        )}
        <Icon name="chevronDown" className={s("chevron")} aria-hidden="true" />
      </button>

      {name && selectedValues.map((value) => <input key={value} type="hidden" name={name} value={value} />)}
      {error && <p className={s("error")}>{error}</p>}

      {isOpen &&
        <ThemedPortal>
          <div ref={panelRef} className={s("panel")} style={position} onKeyDown={searchable ? onKeyDown : undefined}>
            {searchable && (
              <input
                autoFocus
                value={query}
                placeholder={labels.searchPlaceholder}
                aria-label={labels.searchPlaceholder}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                className={s("search")}
              />
            )}
            <ul id={listId} role="listbox" aria-multiselectable={props.multiple || undefined} className={s("list")}>
              {visible.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <li
                    key={option.value}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(option)}
                    className={s(
                      "option",
                      index === activeIndex && !option.disabled && s("optionActive"),
                      isSelected && s("optionSelected"),
                      option.disabled && s("optionDisabled"),
                    )}
                  >
                    {option.icon && <span className={s("optionIcon")}>{option.icon}</span>}
                    {option.label}
                    {isSelected && <Icon name="check" className={s("check")} aria-hidden="true" />}
                  </li>
                );
              })}
              {!visible.length && <li className={s("empty")}>{labels.noOptions}</li>}
            </ul>
          </div>
        </ThemedPortal>}
    </div>
  );
}
