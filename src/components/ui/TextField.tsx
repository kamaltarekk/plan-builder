import type { ChangeEvent } from 'react';
import { cn } from '@/lib/cn';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  type?: 'text' | 'tel';
  inputMode?: 'text' | 'tel' | 'numeric';
  autoComplete?: string;
  dir?: 'rtl' | 'ltr';
}

export default function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  inputMode = 'text',
  autoComplete,
  dir = 'rtl',
}: TextFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        dir={dir}
        autoComplete={autoComplete}
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
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
