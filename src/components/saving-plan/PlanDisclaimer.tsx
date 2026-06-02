import { cn } from '@/lib/cn';
import { COPY } from '@/lib/savingPlanContent';

interface PlanDisclaimerProps {
  className?: string;
}

export default function PlanDisclaimer({ className }: PlanDisclaimerProps) {
  return (
    <p
      className={cn(
        'text-xs leading-6 text-sabika-silver sm:text-sm',
        className,
      )}
    >
      {COPY.result.disclaimer}
    </p>
  );
}
