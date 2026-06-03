import NumberField from '@/components/ui/NumberField';
import SelectableOption from '@/components/ui/SelectableOption';
import { COPY, SALARY_RANGES } from '@/lib/savingPlanContent';
import type { SalaryRangeKey } from '@/lib/savingPlanTypes';

interface SalaryRangeStepProps {
  selected: SalaryRangeKey | null;
  onSelect: (key: SalaryRangeKey) => void;
  customSalaryText: string;
  onCustomSalaryChange: (text: string) => void;
  customSalaryError: string | null;
}

export default function SalaryRangeStep({
  selected,
  onSelect,
  customSalaryText,
  onCustomSalaryChange,
  customSalaryError,
}: SalaryRangeStepProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 text-lg font-bold sm:text-xl">
        {COPY.steps.salary.question}
      </legend>
      <p className="mb-3 text-sm text-sabika-silver">
        {COPY.steps.salary.support}
      </p>
      <div className="space-y-3">
        {SALARY_RANGES.map((range) => (
          <SelectableOption
            key={range.key}
            name="salary-range"
            value={range.key}
            checked={selected === range.key}
            onChange={(value) => onSelect(value as SalaryRangeKey)}
            label={range.label}
            extra={
              range.key === 'more_than_75000' ? (
                <div className="space-y-2">
                  <p className="text-sm text-sabika-silver">
                    {COPY.steps.salary.highSalaryPrompt}
                  </p>
                  <NumberField
                    id="custom-salary"
                    label={COPY.steps.salary.highSalaryFieldLabel}
                    value={customSalaryText}
                    onChange={onCustomSalaryChange}
                    placeholder={COPY.steps.salary.highSalaryPlaceholder}
                    error={customSalaryError}
                    suffix={COPY.units.egp}
                  />
                </div>
              ) : undefined
            }
          />
        ))}
      </div>
    </fieldset>
  );
}
