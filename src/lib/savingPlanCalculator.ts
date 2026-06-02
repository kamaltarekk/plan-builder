import {
  ALLOCATION_MAP,
  BEHAVIORAL_GOALS,
  COPY,
  GOAL_GOLD_GRAMS,
  GOAL_LABELS,
  GOAL_SILVER_GRAMS,
  HIGH_SALARY_MIN,
  SALARY_MAX,
  SALARY_MIDPOINTS,
  SILVER_GRAMS_PER_OUNCE,
} from './savingPlanContent';
import { isValidPrice } from './savingPlanValidation';
import type {
  CalculationResult,
  GoalProgress,
  MetalPrice,
  PlanInputs,
} from './savingPlanTypes';

/** Division that never yields NaN/Infinity. Returns 0 for invalid divisors. */
export function safeDivide(numerator: number, denominator: number): number {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator === 0
  ) {
    return 0;
  }
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : 0;
}

function resolveMonthlyIncome(inputs: PlanInputs): {
  income: number;
  usedCustom: boolean;
} {
  if (inputs.salaryRangeKey === 'more_than_75000') {
    const custom = inputs.customSalaryValue;
    if (
      typeof custom === 'number' &&
      Number.isFinite(custom) &&
      custom >= HIGH_SALARY_MIN &&
      custom <= SALARY_MAX
    ) {
      return { income: custom, usedCustom: true };
    }
    return { income: SALARY_MIDPOINTS.more_than_75000, usedCustom: false };
  }
  return { income: SALARY_MIDPOINTS[inputs.salaryRangeKey], usedCustom: false };
}

function buildGoalProgress(
  inputs: PlanInputs,
  price: MetalPrice,
  monthlyGoldBudget: number,
  monthlySilverBudget: number,
): GoalProgress {
  const { goal } = inputs;

  if (BEHAVIORAL_GOALS.includes(goal)) {
    return { kind: 'behavioral', message: COPY.result.behavioralMessage };
  }

  const goldGrams = GOAL_GOLD_GRAMS[goal];
  if (typeof goldGrams === 'number') {
    if (monthlyGoldBudget <= 0) {
      return {
        kind: 'metal_missing',
        metal: 'gold',
        message: COPY.result.goldMismatch,
      };
    }
    const monthsToGoal = Math.ceil(
      safeDivide(goldGrams * price.goldPricePerGram, monthlyGoldBudget),
    );
    return {
      kind: 'months_to_goal',
      metal: 'gold',
      monthsToGoal,
      goalLabel: GOAL_LABELS[goal],
    };
  }

  const silverGrams = GOAL_SILVER_GRAMS[goal];
  if (typeof silverGrams === 'number') {
    if (monthlySilverBudget <= 0) {
      return {
        kind: 'metal_missing',
        metal: 'silver',
        message: COPY.result.silverMismatch,
      };
    }
    const monthsToGoal = Math.ceil(
      safeDivide(silverGrams * price.silverPricePerGram, monthlySilverBudget),
    );
    return {
      kind: 'months_to_goal',
      metal: 'silver',
      monthsToGoal,
      goalLabel: GOAL_LABELS[goal],
    };
  }

  // Defensive fallback (unreachable for the defined GoalKey union).
  return { kind: 'behavioral', message: COPY.result.behavioralMessage };
}

export function calculateSavingPlan(
  inputs: PlanInputs,
  price: MetalPrice,
): CalculationResult {
  // No fake numbers: bail out cleanly if prices are not usable.
  if (!isValidPrice(price)) {
    return { ok: false, error: COPY.priceUnavailable };
  }

  const { income, usedCustom } = resolveMonthlyIncome(inputs);
  const allocation = ALLOCATION_MAP[inputs.allocationKey];

  const monthlySavingAmount = income * (inputs.savingPercentage / 100);
  const totalContribution = monthlySavingAmount * inputs.durationMonths;

  const monthlyGoldBudget = monthlySavingAmount * (allocation.gold / 100);
  const monthlySilverBudget = monthlySavingAmount * (allocation.silver / 100);
  const totalGoldBudget = monthlyGoldBudget * inputs.durationMonths;
  const totalSilverBudget = monthlySilverBudget * inputs.durationMonths;

  const estimatedGoldGrams = safeDivide(totalGoldBudget, price.goldPricePerGram);
  const estimatedSilverGrams = safeDivide(
    totalSilverBudget,
    price.silverPricePerGram,
  );
  const estimatedSilverOz = safeDivide(
    estimatedSilverGrams,
    SILVER_GRAMS_PER_OUNCE,
  );

  const goalProgress = buildGoalProgress(
    inputs,
    price,
    monthlyGoldBudget,
    monthlySilverBudget,
  );

  return {
    ok: true,
    result: {
      selectedMonthlyIncome: income,
      usedCustomSalary: usedCustom,
      monthlySavingAmount,
      totalContribution,
      monthlyGoldBudget,
      monthlySilverBudget,
      totalGoldBudget,
      totalSilverBudget,
      estimatedGoldGrams,
      estimatedSilverGrams,
      estimatedSilverOz,
      allocation,
      goal: inputs.goal,
      durationMonths: inputs.durationMonths,
      goalProgress,
    },
  };
}
