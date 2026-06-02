import SelectableOption from '@/components/ui/SelectableOption';
import { COPY, DURATIONS } from '@/lib/savingPlanContent';
import type { DurationMonths } from '@/lib/savingPlanTypes';

interface DurationStepProps {
  selected: DurationMonths | null;
  onSelect: (months: DurationMonths) => void;
}

export default function DurationStep({ selected, onSelect }: DurationStepProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-lg font-bold sm:text-xl">
        {COPY.steps.duration.question}
      </legend>
      <div className="grid grid-cols-2 gap-3">
        {DURATIONS.map((duration) => (
          <SelectableOption
            key={duration.value}
            name="duration"
            value={String(duration.value)}
            checked={selected === duration.value}
            onChange={(value) => onSelect(Number(value) as DurationMonths)}
            label={duration.label}
          />
        ))}
      </div>
    </fieldset>
  );
}
