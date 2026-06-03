import {
  COPY,
  HIGH_SALARY_MIN,
  PERCENTAGE_MAX,
  PERCENTAGE_MIN,
  SALARY_MAX,
} from './savingPlanContent';
import type {
  AllocationKey,
  DurationMonths,
  GoalKey,
  MetalPrice,
  PlanInputs,
  SalaryRangeKey,
} from './savingPlanTypes';

export type Validated<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

function normalizeDigits(input: string): string {
  return input.replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));
}

/** Parses user input (Latin or Arabic digits, optional thousands separators). */
function parseNumeric(raw: string | number): number {
  if (typeof raw === 'number') return raw;
  const cleaned = normalizeDigits(raw).replace(/[,\s٬]/g, '');
  if (cleaned === '') return Number.NaN;
  return Number(cleaned);
}

export function validateCustomSalary(raw: string | number): Validated<number> {
  const value = parseNumeric(raw);
  if (!Number.isFinite(value)) {
    return { ok: false, message: COPY.validation.salaryNotNumber };
  }
  if (value < HIGH_SALARY_MIN) {
    return { ok: false, message: COPY.validation.salaryTooLow };
  }
  if (value > SALARY_MAX) {
    return { ok: false, message: COPY.validation.salaryTooHigh };
  }
  return { ok: true, value };
}

export function validateCustomPercentage(raw: string | number): Validated<number> {
  const value = parseNumeric(raw);
  if (!Number.isFinite(value)) {
    return { ok: false, message: COPY.validation.percentageNotNumber };
  }
  if (value < PERCENTAGE_MIN) {
    return { ok: false, message: COPY.validation.percentageTooLow };
  }
  if (value > PERCENTAGE_MAX) {
    return { ok: false, message: COPY.validation.percentageTooHigh };
  }
  return { ok: true, value };
}

export function isValidPrice(
  price: MetalPrice | null | undefined,
): price is MetalPrice {
  return (
    !!price &&
    Number.isFinite(price.goldPricePerGram) &&
    price.goldPricePerGram > 0 &&
    Number.isFinite(price.silverPricePerGram) &&
    price.silverPricePerGram > 0
  );
}

export function affordabilityMessage(percentage: number): string {
  if (!Number.isFinite(percentage)) return '';
  if (percentage <= 5) return COPY.affordability.calm;
  if (percentage <= 10) return COPY.affordability.balanced;
  if (percentage <= 20) return COPY.affordability.faster;
  return COPY.affordability.heavy;
}

export interface PlanDraft {
  salaryRangeKey: SalaryRangeKey | null;
  customSalaryValue: number | null;
  savingPercentage: number | null;
  goal: GoalKey | null;
  durationMonths: DurationMonths | null;
  allocationKey: AllocationKey | null;
}

export type PlanInputsValidation =
  | { ok: true; inputs: PlanInputs }
  | { ok: false; errors: string[] };

export function validatePlanInputs(draft: PlanDraft): PlanInputsValidation {
  const errors: string[] = [];
  const {
    salaryRangeKey,
    customSalaryValue,
    savingPercentage,
    goal,
    durationMonths,
    allocationKey,
  } = draft;

  if (!salaryRangeKey) errors.push(COPY.validation.salaryRequired);
  if (savingPercentage == null || !Number.isFinite(savingPercentage)) {
    errors.push(COPY.validation.percentageRequired);
  } else if (
    savingPercentage < PERCENTAGE_MIN ||
    savingPercentage > PERCENTAGE_MAX
  ) {
    errors.push(
      savingPercentage < PERCENTAGE_MIN
        ? COPY.validation.percentageTooLow
        : COPY.validation.percentageTooHigh,
    );
  }
  if (!goal) errors.push(COPY.validation.goalRequired);
  if (durationMonths == null) errors.push(COPY.validation.durationRequired);
  if (!allocationKey) errors.push(COPY.validation.allocationRequired);

  if (
    salaryRangeKey === 'more_than_75000' &&
    customSalaryValue != null
  ) {
    const salary = validateCustomSalary(customSalaryValue);
    if (!salary.ok) errors.push(salary.message);
  }

  if (
    errors.length === 0 &&
    salaryRangeKey &&
    savingPercentage != null &&
    goal &&
    durationMonths != null &&
    allocationKey
  ) {
    return {
      ok: true,
      inputs: {
        salaryRangeKey,
        customSalaryValue: customSalaryValue ?? undefined,
        savingPercentage,
        goal,
        durationMonths,
        allocationKey,
      },
    };
  }

  return { ok: false, errors };
}
