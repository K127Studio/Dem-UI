import { useId, type ReactNode } from "react";
import { useDefaults, useStyles } from "@dem-ui/foundation";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  /** Adds a hidden input carrying "on" while checked, for native forms. */
  name?: string;
  id?: string;
  "aria-label"?: string;
  className?: string;
  classNames?: Partial<Record<"root" | "track" | "thumb" | "text" | "label" | "description", string>>;
}

export function Switch(rawProps: SwitchProps) {
  const {
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  name,
  id,
  "aria-label": ariaLabel,
  className,
  classNames,
} = useDefaults("switch", rawProps);
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const s = useStyles("switch", { size, checked, thumbOffset: checked ? size : undefined }, classNames);

  return (
    <div className={s("root", className)}>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        aria-labelledby={label ? `${switchId}-label` : undefined}
        aria-describedby={description ? `${switchId}-description` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={s("track")}
      >
        <span className={s("thumb")} />
      </button>
      {name && checked && <input type="hidden" name={name} value="on" />}
      {(label || description) && (
        <div className={s("text")}>
          {label && (
            <label id={`${switchId}-label`} htmlFor={switchId} className={s("label")}>
              {label}
            </label>
          )}
          {description && (
            <span id={`${switchId}-description`} className={s("description")}>
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
