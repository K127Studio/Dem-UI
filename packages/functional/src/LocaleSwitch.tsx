import { useState, type ReactNode } from "react";
import { Button, type ButtonProps } from "@dem-ui/base";
import { Modal } from "./Modal";
import { Icon, useStyles, useUI } from "@dem-ui/foundation";

export interface LocaleOption {
  code: string;
  label: ReactNode;
  /** Usually `<Flag code="kh" />` from @dem-ui/flags. */
  flag?: ReactNode;
}

export interface LocaleSwitchProps {
  locales: LocaleOption[];
  /** The current language. */
  value: string;
  /** Change the route here: the router is the project's. */
  onChange: (code: string) => void;
  title?: ReactNode;
  /** Shows only the flag on the button that opens the dialog. */
  iconOnly?: boolean;
  triggerProps?: Omit<ButtonProps, "onClick" | "children" | "icon">;
  size?: "sm" | "md" | "lg";
  className?: string;
  classNames?: Partial<Record<"list", string>>;
}

/** A button with the current language, opening a dialog with one button per language. */
export function LocaleSwitch({ locales, value, onChange, title, iconOnly = false, triggerProps, size = "sm", className, classNames }: LocaleSwitchProps) {
  const { labels } = useUI();
  const s = useStyles("localeSwitch", {}, classNames);
  const [isOpen, setIsOpen] = useState(false);
  const current = locales.find((locale) => locale.code === value);
  const heading = title ?? labels.language;

  return (
    <>
      <Button
        variant="ghost"
        size={iconOnly ? "icon" : "md"}
        icon={current?.flag ?? <Icon name="globe" className="h-5 w-5" />}
        aria-label={iconOnly ? String(heading) : undefined}
        aria-haspopup="dialog"
        title={iconOnly ? String(heading) : undefined}
        className={className}
        {...triggerProps}
        onClick={() => setIsOpen(true)}
      >
        {!iconOnly && current?.label}
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size={size} mobile="card">
        <Modal.Header>{heading}</Modal.Header>
        <Modal.Body>
          <div className={s("list")}>
            {locales.map((locale) => {
              const isCurrent = locale.code === value;
              return (
                <Button
                  key={locale.code}
                  fullWidth
                  variant={isCurrent ? "primary" : "outline"}
                  icon={locale.flag}
                  aria-current={isCurrent ? "true" : undefined}
                  onClick={() => {
                    setIsOpen(false);
                    if (!isCurrent) onChange(locale.code);
                  }}
                >
                  {locale.label}
                </Button>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
