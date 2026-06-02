import NumberField from '@/components/ui/NumberField';
import SelectableOption from '@/components/ui/SelectableOption';
import { COPY, PERCENTAGE_OPTIONS } from '@/lib/savingPlanContent';

export type PercentageChoice = number | 'custom';

interface PercentageStepProps {
  choice: PercentageChoice | null;
  onChoose: (choice: PercentageChoice) => void;
  customPercentageText: string;
  onCustomPercentageChange: (text: string) => void;
  customPercentageError: string | null;
  affordability: string;
}

export default function PercentageStep({
  choice,
  onChoose,
  customPercentageText,
  onCustomPercentageChange,
  customPercentageError,
  affordability,
}: PercentageStepProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-lg font-bold sm:text-xl">
        {COPY.steps.percentage.question}
      </legend>
      <div className="space-y-3">
        {PERCENTAGE_OPTIONS.map((option) => (
          <SelectableOption
            key={option.value}
            name="saving-percentage"
            value={String(option.value)}
            checked={choice === option.value}
            onChange={(value) => onChoose(Number(value))}
            label={option.label}
          />
        ))}
        <SelectableOption
          name="saving-percentage"
          value="custom"
          checked={choice === 'custom'}
          onChange={() => onChoose('custom')}
          label={COPY.steps.percentage.customLabel}
          extra={
            <NumberField
              id="custom-percentage"
              label={COPY.steps.percentage.customFieldLabel}
              value={customPercentageText}
              onChange={onCustomPercentageChange}
              placeholder={COPY.steps.percentage.customPlaceholder}
              error={customPercentageError}
              suffix="%"
            />
          }
        />
      </div>
      {affordability ? (
        <p className="rounded-lg bg-sabika-gold-light/40 p-3 text-sm leading-6 text-sabika-ink-soft">
          {affordability}
        </p>
      ) : null}
    </fieldset>
  );
}
