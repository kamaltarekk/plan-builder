import SelectableOption from '@/components/ui/SelectableOption';
import { ALLOCATIONS, COPY } from '@/lib/savingPlanContent';
import type { AllocationKey } from '@/lib/savingPlanTypes';

interface AllocationStepProps {
  selected: AllocationKey | null;
  onSelect: (key: AllocationKey) => void;
}

export default function AllocationStep({
  selected,
  onSelect,
}: AllocationStepProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-lg font-bold sm:text-xl">
        {COPY.steps.allocation.question}
      </legend>
      <div className="space-y-3">
        {ALLOCATIONS.map((option) => (
          <SelectableOption
            key={option.key}
            name="allocation"
            value={option.key}
            checked={selected === option.key}
            onChange={(value) => onSelect(value as AllocationKey)}
            label={option.label}
          />
        ))}
      </div>
    </fieldset>
  );
}
