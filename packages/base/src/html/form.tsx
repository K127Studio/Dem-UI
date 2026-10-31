import { useEffect, useId, useRef, type DetailsHTMLAttributes, type FieldsetHTMLAttributes, type FormHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { Icon, useDefaults, useStyles } from "@dem-ui/foundation";
import { Input, Label, type InputProps } from "../controls/Input";

/** A form with the theme's spacing between fields. */
export function Form({ className, ...props }: FormHTMLAttributes<HTMLFormElement>) {
  const s = useStyles("form");
  return <form className={s("formRoot", className)} {...props} />;
}

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Names the group of fields. */
  legend?: ReactNode;
  /** Disables every field inside. */
  isDisabled?: boolean;
}

export function Fieldset(rawProps: FieldsetProps) {
  const { legend, isDisabled, disabled, children, className, ...props } = useDefaults("fieldset", rawProps);
  const s = useStyles("fieldset");
  return (
    <fieldset disabled={isDisabled ?? disabled} className={s("root", className)} {...props}>
      {legend && <Legend>{legend}</Legend>}
      {children}
    </fieldset>
  );
}

export function Legend({ className, ...props }: HTMLAttributes<HTMLLegendElement>) {
  const s = useStyles("fieldset");
  return <legend className={s("legend", className)} {...props} />;
}

export type TextareaProps = Omit<InputProps, "as" | "leftIcon" | "rightIcon" | "type">;

/** `Input as="textarea"`, under the name of the HTML element. */
export function Textarea(props: TextareaProps) {
  return <Input {...props} as="textarea" />;
}

interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
}

function FieldMessages({ id, description, error }: { id: string; description?: ReactNode; error?: ReactNode }) {
  const s = useStyles("choice");
  return (
    <>
      {description && (
        <span id={`${id}-description`} className={s("description")}>
          {description}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className={s("error")}>
          {error}
        </span>
      )}
    </>
  );
}

const describedBy = (id: string, description?: ReactNode, error?: ReactNode) =>
  [description && `${id}-description`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

export interface CheckboxProps extends ChoiceProps {
  /** Receives the new state, not the event. */
  onChange?: (checked: boolean) => void;
  /** The third state: some of a group are on. Can only be set from here, it has no HTML attribute. */
  isIndeterminate?: boolean;
}

export function Checkbox(rawProps: CheckboxProps) {
  const { label, description, error, onChange, isIndeterminate = false, id, className, ...props } = useDefaults("choice", rawProps);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const ref = useRef<HTMLInputElement>(null);
  const s = useStyles("choice", { kind: "checkbox", invalid: Boolean(error) });

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  return (
    <div className={s("root", className)}>
      <input
        ref={ref}
        id={fieldId}
        type="checkbox"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, description, error)}
        onChange={(event) => onChange?.(event.target.checked)}
        className={s("input")}
        {...props}
      />
      <div className={s("text")}>
        {label && (
          <label htmlFor={fieldId} className={s("label")}>
            {label}
          </label>
        )}
        <FieldMessages id={fieldId} description={description} error={error} />
      </div>
    </div>
  );
}

export interface RadioProps extends ChoiceProps {
  /** Receives the value of this radio when it is chosen. */
  onChange?: (value: string) => void;
}

/** One option. Usually through `RadioGroup`. */
export function Radio(rawProps: RadioProps) {
  const { label, description, error, onChange, id, className, ...props } = useDefaults("choice", rawProps);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const s = useStyles("choice", { kind: "radio", invalid: Boolean(error) });
  return (
    <div className={s("root", className)}>
      <input
        id={fieldId}
        type="radio"
        aria-describedby={describedBy(fieldId, description, error)}
        onChange={(event) => onChange?.(event.target.value)}
        className={s("input")}
        {...props}
      />
      <div className={s("text")}>
        {label && (
          <label htmlFor={fieldId} className={s("label")}>
            {label}
          </label>
        )}
        <FieldMessages id={fieldId} description={description} error={error} />
      </div>
    </div>
  );
}

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** The group's name for the form. Generated when omitted. */
  name?: string;
  label?: ReactNode;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** Side by side. */
  isInline?: boolean;
  error?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function RadioGroup(rawProps: RadioGroupProps) {
  const { name, label, options, value, onChange, isInline = false, error, disabled, className } = useDefaults("radioGroup", rawProps);
  const generatedName = useId();
  const s = useStyles("radioGroup", { isInline });
  return (
    <Fieldset isDisabled={disabled} className={className}>
      {label && <Legend>{label}</Legend>}
      <div className={s("options")}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name ?? generatedName}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            checked={value === option.value}
            onChange={onChange}
          />
        ))}
      </div>
      {error && (
        <p role="alert" className={s("error")}>
          {error}
        </p>
      )}
    </Fieldset>
  );
}

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "size"> {
  label?: ReactNode;
  /** Shown as a first, empty option. */
  placeholder?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  /** Receives the value, not the event. */
  onChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  description?: ReactNode;
  error?: ReactNode;
}

/**
 * The browser's own select. On a phone it opens the system picker, and it posts in a plain form:
 * prefer it for long lists. `Select` is the one that can be styled inside.
 */
export function NativeSelect(rawProps: NativeSelectProps) {
  const { label, placeholder, options, onChange, size = "md", description, error, id, required, className, ...props } = useDefaults("nativeSelect", rawProps);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const s = useStyles("nativeSelect", { size, invalid: Boolean(error) });
  return (
    <div className={s("root")}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}
      <div className={s("wrapper")}>
        <select
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, description, error)}
          onChange={(event) => onChange?.(event.target.value)}
          className={s("field", className)}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" className={s("chevron")} />
      </div>
      {(description || error) && (
        <div className={s("messages")}>
          <FieldMessages id={fieldId} description={description} error={error} />
        </div>
      )}
    </div>
  );
}

export interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value"> {
  label?: ReactNode;
  value: number;
  /** Receives a number, not the event. */
  onChange?: (value: number) => void;
  /** Shows the number beside the label. */
  showValue?: boolean;
  /** Appended to the number: "%". */
  unit?: string;
}

/** A slider. */
export function Range(rawProps: RangeProps) {
  const { label, value, onChange, showValue = true, unit = "", id, className, ...props } = useDefaults("range", rawProps);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const s = useStyles("range");
  return (
    <div className={s("root", className)}>
      {(label || showValue) && (
        <div className={s("head")}>
          {label && <label htmlFor={fieldId}>{label}</label>}
          {showValue && (
            <output htmlFor={fieldId} className={s("value")}>
              {value}
              {unit}
            </output>
          )}
        </div>
      )}
      <input id={fieldId} type="range" value={value} onChange={(event) => onChange?.(Number(event.target.value))} className={s("input")} {...props} />
    </div>
  );
}

export interface ProgressProps extends Omit<HTMLAttributes<HTMLProgressElement>, "children"> {
  /** Leave it out while the end is unknown: the bar then animates. */
  value?: number;
  max?: number;
  label?: ReactNode;
  showValue?: boolean;
}

/** How far a task has gone. For a measure within a range, see `Meter`. */
export function Progress(rawProps: ProgressProps) {
  const { value, max = 100, label, showValue = false, id, className, ...props } = useDefaults("progress", rawProps);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const s = useStyles("progress");
  return (
    <div className={s("root", className)}>
      {(label || (showValue && value !== undefined)) && (
        <div className={s("head")}>
          {label && <label htmlFor={fieldId}>{label}</label>}
          {showValue && value !== undefined && <span className={s("value")}>{Math.round((value / max) * 100)}%</span>}
        </div>
      )}
      <progress id={fieldId} value={value} max={max} className={s("bar")} {...props} />
    </div>
  );
}

export interface MeterProps extends Omit<HTMLAttributes<HTMLMeterElement>, "children"> {
  value: number;
  min?: number;
  max?: number;
  /** Below this the value counts as low. */
  low?: number;
  /** Above this the value counts as high. */
  high?: number;
  /** The best value: the browser colours the bar from these. */
  optimum?: number;
  label?: ReactNode;
  showValue?: boolean;
}

/** A measure within a known range: disk space, a score. */
export function Meter(rawProps: MeterProps) {
  const { value, min = 0, max = 1, low, high, optimum, label, showValue = false, id, className, ...props } = useDefaults("meter", rawProps);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const s = useStyles("progress");
  return (
    <div className={s("root", className)}>
      {(label || showValue) && (
        <div className={s("head")}>
          {label && <label htmlFor={fieldId}>{label}</label>}
          {showValue && <span className={s("value")}>{value}</span>}
        </div>
      )}
      <meter id={fieldId} value={value} min={min} max={max} low={low} high={high} optimum={optimum} className={s("bar")} {...props} />
    </div>
  );
}

export interface DetailsProps extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "onToggle"> {
  /** What stays visible. */
  summary: ReactNode;
  /** Starts open, or controls it together with `onToggle`. */
  isOpen?: boolean;
  /** Receives the new state. */
  onToggle?: (isOpen: boolean) => void;
}

/**
 * Native open and close: works without JavaScript, and the browser's find can open it. With
 * animation and groups where one is open at a time, see `Accordion` in functional.
 */
export function Details(rawProps: DetailsProps) {
  const { summary, isOpen, onToggle, children, className, ...props } = useDefaults("details", rawProps);
  const s = useStyles("details");
  return (
    <details open={isOpen} onToggle={(event) => onToggle?.(event.currentTarget.open)} className={s("root", className)} {...props}>
      <summary className={s("summary")}>
        {summary}
        <Icon name="chevronDown" className={s("chevron")} />
      </summary>
      <div className={s("content")}>{children}</div>
    </details>
  );
}
