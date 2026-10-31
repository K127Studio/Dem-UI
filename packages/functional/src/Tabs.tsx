import { createContext, useContext, useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { useDefaults, useStyles } from "@dem-ui/foundation";

type TabsVariant = "underline" | "pills" | "enclosed" | (string & {});
type Orientation = "horizontal" | "vertical";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  orientation: Orientation;
  variant: TabsVariant;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs.* components must be rendered inside <Tabs>");
  return context;
}

export interface TabsProps {
  children: ReactNode;
  /** Uncontrolled starting tab. */
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: Orientation;
  variant?: TabsVariant;
  className?: string;
}

export function Tabs(rawProps: TabsProps) {
  const {
  children,
  defaultValue = "",
  value,
  onValueChange,
  orientation = "horizontal",
  variant = "underline",
  className,
} = useDefaults("tabs", rawProps);
  const [internal, setInternal] = useState(defaultValue);
  const baseId = useId();
  const s = useStyles("tabs", { orientation, variant });
  const current = value ?? internal;
  const setValue = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  return (
    <TabsContext.Provider value={{ value: current, setValue, orientation, variant, baseId }}>
      <div className={s("root", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  const { orientation, variant } = useTabs();
  const s = useStyles("tabs", { orientation, variant });

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const forward = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const back = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    if (![forward, back, "Home", "End"].includes(event.key)) return;
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      event.key === "Home"
        ? tabs[0]
        : event.key === "End"
          ? tabs[tabs.length - 1]
          : tabs[(index + (event.key === forward ? 1 : -1) + tabs.length) % tabs.length];
    event.preventDefault();
    next?.focus();
    next?.click();
  };

  return (
    <div role="tablist" aria-orientation={orientation} onKeyDown={onKeyDown} className={s("list", className)}>
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({ value, children, disabled, className }: TabsTriggerProps) {
  const { value: current, setValue, variant, baseId } = useTabs();
  const s = useStyles("tabs", { variant });
  const isActive = current === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => setValue(value)}
      className={s("trigger", isActive && s("triggerActive"), className)}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  /** Keeps the panel mounted while hidden, so what was typed in it survives. */
  keepMounted?: boolean;
  className?: string;
}

export function TabsContent({ value, children, keepMounted = false, className }: TabsContentProps) {
  const { value: current, baseId } = useTabs();
  const s = useStyles("tabs");
  const isActive = current === value;
  if (!isActive && !keepMounted) return null;
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!isActive}
      tabIndex={0}
      className={s("content", className)}
    >
      {children}
    </div>
  );
}
