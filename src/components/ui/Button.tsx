import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-sabika-gold text-sabika-ink hover:bg-sabika-gold-dark hover:text-white',
  secondary:
    'bg-white text-sabika-ink border border-sabika-silver-light hover:border-sabika-gold',
  ghost: 'bg-transparent text-sabika-ink hover:bg-sabika-gold-light/50',
};

export default function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sabika-gold',
        fullWidth && 'w-full',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
