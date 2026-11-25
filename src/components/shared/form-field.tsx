import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "name"
> {
  name: string;
  label: string;
  error?: string;
  hint?: string;
}

export function FormField({
  name,
  label,
  error,
  hint,
  className = "",
  ...props
}: FormFieldProps) {
  const id = `field-${name}`;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="label-caps mb-2 block">
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`block w-full border bg-paper px-4 py-3 text-ink ${
          error ? "border-error" : "border-ink/20"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-stone-text">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
