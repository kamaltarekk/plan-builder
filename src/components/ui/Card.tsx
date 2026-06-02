import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn('rounded-xl2 bg-white p-5 shadow-card', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
