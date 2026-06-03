import SelectableOption from '@/components/ui/SelectableOption';
import { COPY, GOALS } from '@/lib/savingPlanContent';
import type { GoalKey } from '@/lib/savingPlanTypes';

interface GoalStepProps {
  selected: GoalKey | null;
  onSelect: (goal: GoalKey) => void;
}

export default function GoalStep({ selected, onSelect }: GoalStepProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-lg font-bold sm:text-xl">
        {COPY.steps.goal.question}
      </legend>
      <div className="space-y-3">
        {GOALS.map((goal) => (
          <SelectableOption
            key={goal.key}
            name="goal"
            value={goal.key}
            checked={selected === goal.key}
            onChange={(value) => onSelect(value as GoalKey)}
            label={goal.label}
          />
        ))}
      </div>
    </fieldset>
  );
}
