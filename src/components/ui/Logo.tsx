import { cn } from '@/lib/cn';

interface LogoProps {
  className?: string;
}

// Single integration point for the Sabika brand mark. Swap the inner markup
// for the official logo <img> here and it updates everywhere it's used.
export default function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-2xl font-extrabold tracking-tight text-sabika-gold-dark',
        className,
      )}
    >
      سبيكة
    </span>
  );
}
