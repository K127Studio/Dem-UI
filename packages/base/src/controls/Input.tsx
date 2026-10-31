import { useId, type ElementType, type InputHTMLAttributes, type ReactNode, type Ref, type TextareaHTMLAttributes } from "react";
import { useDefaults, useStyles } from "@dem-ui/foundation";

export interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  id?: string;
  icon?: ElementType<{ className?: string }>;
  required?: boolean;
  className?: string;
  classNames?: Partial<Record<"root" | "icon" | "required", string>>;
}

export function Label({ children, htmlFor, id, icon: Icon, required, className, classNames }: LabelProps) {
  const s = useStyles("label", {}, classNames);
  return (
    <label htmlFor={htmlFor} id={id} className={s("root", className)}>
      {Icon && <Icon className={s("icon")} />}
      {children}
      {required && (
        <span className={s("required")} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

type InputSlots = "root" | "wrapper" | "field" | "leftIcon" | "rightIcon" | "description" | "error";
type SharedHtml = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | keyof InputHTMLAttributes<HTMLInputElement>>;

export interface InputProps extends SharedHtml {
  label?: ReactNode;
  labelIcon?: LabelProps["icon"];
  labelClassName?: string;
  description?: ReactNode;
  error?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: "sm" | "md" | "lg";
  roundness?: "none" | "sm" | "md" | "lg" | "full";
  as?: "input" | "textarea";
  rows?: number;
  /** Receives the value, not the event. */
  onChange?: (value: string) => void;
  classNames?: Partial<Record<InputSlots, string>>;
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
}

export function Input(rawProps: InputProps) {
  const {
  label,
  labelIcon,
  labelClassName,
  description,
  error,
  leftIcon,
  rightIcon,
  size = "md",
  roundness,
  as = "input",
  rows = 4,
  id,
  required,
  onChange,
  className,
  classNames,
  ref,
  ...props
} = useDefaults("input", rawProps);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = error ? `${fieldId}-error` : description ? `${fieldId}-description` : undefined;
  const s = useStyles(
    "input",
    { size, roundness, invalid: Boolean(error), hasLeftIcon: Boolean(leftIcon), hasRightIcon: Boolean(rightIcon) },
    classNames,
  );

  const shared = {
    id: fieldId,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: s("field", as === "textarea" && "resize-y", className),
  };

  return (
    <div className={s("root")}>
      {label && (
        <Label htmlFor={fieldId} icon={labelIcon} required={required} className={labelClassName}>
          {label}
        </Label>
      )}
      <div className={s("wrapper")}>
        {leftIcon && <div className={s("leftIcon")}>{leftIcon}</div>}
        {as === "textarea" ? (
          <textarea
            ref={ref as Ref<HTMLTextAreaElement>}
            rows={rows}
            onChange={(e) => onChange?.(e.target.value)}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            {...shared}
          />
        ) : (
          <input
            ref={ref as Ref<HTMLInputElement>}
            onChange={(e) => onChange?.(e.target.value)}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
            {...shared}
          />
        )}
        {rightIcon && <div className={s("rightIcon")}>{rightIcon}</div>}
      </div>
      {error ? (
        <p id={`${fieldId}-error`} className={s("error")}>
          {error}
        </p>
      ) : (
        description && (
          <p id={`${fieldId}-description`} className={s("description")}>
            {description}
          </p>
        )
      )}
    </div>
  );
}
