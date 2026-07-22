import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function FormField({ label, error, id, ...props }: FormFieldProps) {
  return (
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-700 dark:text-slate-200"
    >
      {label}
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 transition outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        {...props}
      />
      {error ? (
        <span id={`${id}-error`} className="mt-1 block text-sm text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}
