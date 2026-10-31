import type { ElementType, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ConfirmModal } from "@dem-ui/functional";
import { Button } from "@dem-ui/base";
import { Switch } from "@dem-ui/base";
import { Icon, useStyles, useUI } from "@dem-ui/foundation";

export function FormCard({ children, className }: { children: ReactNode; className?: string }) {
  const s = useStyles("form");
  return <div className={s("card", className)}>{children}</div>;
}

export interface FormSectionHeadingProps {
  icon?: ElementType<{ className?: string }>;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

export function FormSectionHeading({ icon: HeadingIcon, title, subtitle, className }: FormSectionHeadingProps) {
  const s = useStyles("form");
  return (
    <div className={s("sectionHeading", className)}>
      {HeadingIcon && (
        <div className={s("sectionIconBox")}>
          <HeadingIcon className={s("sectionIcon")} />
        </div>
      )}
      <div className="min-w-0">
        <h3 className={s("sectionTitle")}>{title}</h3>
        {subtitle && <p className={s("sectionSubtitle")}>{subtitle}</p>}
      </div>
    </div>
  );
}

export function FormGroupHeading({ children, className }: { children: ReactNode; className?: string }) {
  const s = useStyles("form");
  return <h4 className={s("groupHeading", className)}>{children}</h4>;
}

export interface ToggleRowProps {
  title: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

export function ToggleRow({ title, description, checked, onChange, disabled, name, className }: ToggleRowProps) {
  const s = useStyles("form");
  return (
    <div className={s("toggleRow", className)}>
      <div className="min-w-0">
        <div className={s("toggleTitle")}>{title}</div>
        {description && <div className={s("toggleDescription")}>{description}</div>}
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        name={name}
        aria-label={typeof title === "string" ? title : undefined}
      />
    </div>
  );
}

export interface FormNoteProps {
  children: ReactNode;
  tone?: "info" | "warning" | "danger";
  className?: string;
}

export function FormNote({ children, tone = "info", className }: FormNoteProps) {
  const s = useStyles("form", { noteTone: tone });
  return <div className={s("note", className)}>{children}</div>;
}

export interface FormErrorDialogProps {
  error?: ReactNode;
  onClose: () => void;
  title?: ReactNode;
  closeLabel?: ReactNode;
}

/** The dialog a failed save opens. */
export function FormErrorDialog({ error, onClose, title = "Error", closeLabel }: FormErrorDialogProps) {
  const { labels } = useUI();
  return (
    <ConfirmModal
      isOpen={Boolean(error)}
      onClose={onClose}
      onConfirm={onClose}
      tone="warning"
      title={title}
      question={error}
      confirmLabel={closeLabel ?? labels.ok}
    />
  );
}

export interface FormActionsProps {
  backHref?: string;
  backLabel?: ReactNode;
  saveLabel?: ReactNode;
  disabled?: boolean;
  /** For forms without a server action. Inside one, `useFormStatus` already reports it. */
  isSaving?: boolean;
  onSave?: () => void;
  /** Extra buttons next to Save. */
  children?: ReactNode;
  className?: string;
}

export function FormActions({ backHref, backLabel, saveLabel, disabled, isSaving, onSave, children, className }: FormActionsProps) {
  const { labels } = useUI();
  const { pending } = useFormStatus();
  const s = useStyles("form");
  const busy = isSaving || pending;
  return (
    <div className={s("actions", className)}>
      <div>
        {backHref && (
          <Button href={backHref} variant="ghost" icon={<Icon name="arrowLeft" className="h-4 w-4" aria-hidden="true" />}>
            {backLabel ?? labels.back}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <Button
          type={onSave ? "button" : "submit"}
          onClick={onSave}
          isLoading={busy}
          disabled={disabled}
          icon={<Icon name="save" className="h-4 w-4" aria-hidden="true" />}
        >
          {saveLabel ?? labels.save}
        </Button>
      </div>
    </div>
  );
}

export function SavingOverlay({ isVisible, label }: { isVisible: boolean; label?: ReactNode }) {
  const { labels } = useUI();
  const s = useStyles("form");
  if (!isVisible) return null;
  return (
    <div role="status" className={s("savingOverlay")}>
      <Icon name="spinner" className={s("savingSpinner")} aria-hidden="true" />
      {label ?? labels.saving}
    </div>
  );
}

export interface LocaleTabsProps {
  locales: { code: string; label: ReactNode; /** Shows a dot: translated or still missing. */ translated?: boolean }[];
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function LocaleTabs({ locales, value, onChange, className }: LocaleTabsProps) {
  const s = useStyles("localeTabs");
  return (
    <div className={s("root", className)}>
      {locales.map((locale) => (
        <button
          key={locale.code}
          type="button"
          aria-pressed={locale.code === value}
          onClick={() => onChange(locale.code)}
          className={s("tab", locale.code === value && s("tabActive"))}
        >
          {locale.label}
          {locale.translated !== undefined && (
            <span className={s("dot", locale.translated ? s("dotDone") : s("dotMissing"))} aria-hidden="true" />
          )}
        </button>
      ))}
    </div>
  );
}
