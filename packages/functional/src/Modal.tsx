import { createContext, useContext, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useDefaults, ThemedPortal, Icon, useStyles, useUI } from "@dem-ui/foundation";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const ModalContext = createContext<{ titleId: string; onClose: () => void } | null>(null);

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full" | (string & {});
  /** `sheet` fills the screen on mobile, `card` keeps its margins. */
  mobile?: "sheet" | "card";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  /** Accessible name, when no `Modal.Header` titles the dialog. */
  "aria-label"?: string;
  className?: string;
  classNames?: Partial<Record<"root" | "backdrop" | "panel", string>>;
}

export function Modal(rawProps: ModalProps) {
  const {
  isOpen,
  onClose,
  children,
  size = "md",
  mobile = "sheet",
  closeOnBackdrop = true,
  closeOnEscape = true,
  "aria-label": ariaLabel,
  className,
  classNames,
} = useDefaults("modal", rawProps);
  const [isMounted, setIsMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const s = useStyles("modal", { size, mobile }, classNames);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [isOpen, isMounted]);

  if (!isMounted || !isOpen) return null;

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && closeOnEscape) {
      event.stopPropagation();
      onClose();
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first) {
      event.preventDefault();
    } else if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <ThemedPortal>
    <div className={s("root")} onKeyDown={onKeyDown}>
      <div className={s("backdrop")} onClick={closeOnBackdrop ? onClose : undefined} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : titleId}
        tabIndex={-1}
        className={s("panel", className)}
      >
        <ModalContext.Provider value={{ titleId, onClose }}>{children}</ModalContext.Provider>
      </div>
    </div>
    </ThemedPortal>
  );
}

export interface ModalHeaderProps {
  children: ReactNode;
  /** Hides the close button. */
  hideClose?: boolean;
  className?: string;
  classNames?: Partial<Record<"header" | "title" | "close", string>>;
}

export function ModalHeader({ children, hideClose = false, className, classNames }: ModalHeaderProps) {
  const context = useContext(ModalContext);
  const { labels } = useUI();
  const s = useStyles("modal", {}, classNames);
  return (
    <div className={s("header", className)}>
      <div id={context?.titleId} className="min-w-0 flex-1">
        {typeof children === "string" ? <h2 className={s("title")}>{children}</h2> : children}
      </div>
      {!hideClose && (
        <button type="button" aria-label={labels.close} onClick={context?.onClose} className={s("close")}>
          <Icon name="close" className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
  const s = useStyles("modal");
  return <div className={s("body", className)}>{children}</div>;
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  const s = useStyles("modal");
  return <div className={s("footer", className)}>{children}</div>;
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
