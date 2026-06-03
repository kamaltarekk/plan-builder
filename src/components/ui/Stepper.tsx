import { cn } from '@/lib/cn';
import { COPY } from '@/lib/savingPlanContent';

interface StepperProps {
  current: number; // 1-based
  total: number;
}

export default function Stepper({ current, total }: StepperProps) {
  const steps = Array.from({ length: total }, (_, index) => index + 1);
  const label = COPY.nav.stepLabel(current, total);

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-sabika-silver">{label}</p>
      <div
        className="flex gap-2"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={label}
      >
        {steps.map((step) => (
          <span
            key={step}
            className={cn(
              'h-2 flex-1 rounded-full transition-colors',
              step <= current ? 'bg-sabika-gold' : 'bg-sabika-silver-light',
            )}
          />
        ))}
      </div>
    </div>
  );
}
