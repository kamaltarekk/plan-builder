import type { ChangeEvent } from 'react';
import { cn } from '@/lib/cn';

interface NumberFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  inputMode?: 'numeric' | 'decimal';
  suffix?: string;
}

export default function NumberField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  inputMode = 'numeric',
  suffix,
}: NumberFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          dir="rtl"
          value={value}
          placeholder={placeholder}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.value)
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full rounded-lg border-2 bg-white px-3 py-2 text-base outline-none transition-colors',
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-sabika-silver-light focus:border-sabika-gold',
          )}
        />
        {suffix ? (
          <span className="text-sm text-sabika-silver">{suffix}</span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
