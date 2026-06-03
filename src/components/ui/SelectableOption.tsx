import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SelectableOptionProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  /** Extra content (e.g. an input) revealed below when this option is selected. */
  extra?: ReactNode;
}

export default function SelectableOption({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  extra,
}: SelectableOptionProps) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 transition-colors',
        checked
          ? 'border-sabika-gold bg-sabika-gold-light/30'
          : 'border-sabika-silver-light bg-white hover:border-sabika-gold/60',
      )}
    >
      <label className="flex cursor-pointer items-start gap-3 p-4">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="mt-1 h-5 w-5 shrink-0 accent-sabika-gold"
        />
        <span className="flex-1">
          <span className="block text-base font-semibold leading-6">
            {label}
          </span>
          {description ? (
            <span className="mt-1 block text-sm text-sabika-silver">
              {description}
            </span>
          ) : null}
        </span>
      </label>
      {checked && extra ? (
        <div className="border-t border-sabika-silver-light/70 px-4 pb-4 pt-3">
          {extra}
        </div>
      ) : null}
    </div>
  );
}
