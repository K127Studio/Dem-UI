import { useId, useState, type ReactNode } from "react";
import { Icon, useStyles } from "@dem-ui/foundation";

type AccordionSlots = "root" | "trigger" | "chevron" | "panel" | "inner" | "content";

export interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  /** Controlled state. Without it the accordion keeps its own, from `defaultOpen`. */
  isOpen?: boolean;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  /** Replaces the chevron. */
  icon?: ReactNode;
  className?: string;
  classNames?: Partial<Record<AccordionSlots, string>>;
}

// The body stays mounted while closed, so what was typed in a closed section is kept.
export function Accordion({
  title,
  children,
  isOpen: controlled,
  defaultOpen = false,
  onToggle,
  icon,
  className,
  classNames,
}: AccordionProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const id = useId();
  const isOpen = controlled ?? internal;
  const s = useStyles<AccordionSlots>("accordion", { isOpen }, classNames);

  const toggle = () => {
    if (controlled === undefined) setInternal(!isOpen);
    onToggle?.(!isOpen);
  };

  return (
    <div className={s("root", className)}>
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          onClick={toggle}
          className={s("trigger")}
        >
          <span className="min-w-0 flex-1">{title}</span>
          {icon ?? <Icon name="chevronDown" className={s("chevron")} aria-hidden="true" />}
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} className={s("panel")}>
        <div className={s("inner")} inert={!isOpen}>
          <div className={s("content")}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export interface AccordionGroupItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionGroupProps {
  items: AccordionGroupItem[];
  /** Allows several sections open at once. */
  multiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
  itemClassNames?: AccordionProps["classNames"];
}

export function AccordionGroup({ items, multiple = false, defaultOpenIds = [], className, itemClassNames }: AccordionGroupProps) {
  const [openIds, setOpenIds] = useState(defaultOpenIds);
  const s = useStyles("accordion");
  return (
    <div className={s("group", className)}>
      {items.map((item) => (
        <Accordion
          key={item.id}
          title={item.title}
          isOpen={openIds.includes(item.id)}
          classNames={itemClassNames}
          onToggle={(open) =>
            setOpenIds((ids) => {
              if (!open) return ids.filter((id) => id !== item.id);
              return multiple ? [...ids, item.id] : [item.id];
            })
          }
        >
          {item.content}
        </Accordion>
      ))}
    </div>
  );
}
