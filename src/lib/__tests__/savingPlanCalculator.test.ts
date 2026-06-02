import { describe, expect, it } from 'vitest';
import { calculateSavingPlan, safeDivide } from '../savingPlanCalculator';
import { SILVER_GRAMS_PER_OUNCE } from '../savingPlanContent';
import type { MetalPrice, PlanInputs, PlanResult } from '../savingPlanTypes';

const PRICE: MetalPrice = {
  goldPricePerGram: 5000,
  silverPricePerGram: 50,
  sourceLabel: 'config_reference',
};

function inputs(overrides: Partial<PlanInputs> = {}): PlanInputs {
  return {
    salaryRangeKey: '20000_35000',
    savingPercentage: 10,
    goal: 'monthly_habit',
    durationMonths: 12,
    allocationKey: 'gold',
    ...overrides,
  };
}

function expectAllFinite(result: PlanResult) {
  const numericValues = [
    result.selectedMonthlyIncome,
    result.monthlySavingAmount,
    result.totalContribution,
    result.monthlyGoldBudget,
    result.monthlySilverBudget,
    result.totalGoldBudget,
    result.totalSilverBudget,
    result.estimatedGoldGrams,
    result.estimatedSilverGrams,
    result.estimatedSilverOz,
  ];
  for (const value of numericValues) {
    expect(Number.isFinite(value)).toBe(true);
  }
  if (result.goalProgress.kind === 'months_to_goal') {
    expect(Number.isFinite(result.goalProgress.monthsToGoal)).toBe(true);
  }
}

describe('calculateSavingPlan', () => {
  it('case 1: 20k–35k, 10%, 12 months, gold only', () => {
    const calc = calculateSavingPlan(inputs(), PRICE);
    expect(calc.ok).toBe(true);
    if (!calc.ok) return;
    const r = calc.result;
    expect(r.selectedMonthlyIncome).toBe(27500);
    expect(r.usedCustomSalary).toBe(false);
    expect(r.monthlySavingAmount).toBe(2750);
    expect(r.totalContribution).toBe(33000);
    expect(r.estimatedGoldGrams).toBeCloseTo(6.6, 5);
    expect(r.estimatedSilverGrams).toBe(0);
    expect(r.goalProgress.kind).toBe('behavioral');
    expectAllFinite(r);
  });

  it('case 2: 50k–75k, 5%, 36 months, 50/50 allocation', () => {
    const calc = calculateSavingPlan(
      inputs({
        salaryRangeKey: '50000_75000',
        savingPercentage: 5,
        durationMonths: 36,
        allocationKey: 'gold50_silver50',
      }),
      PRICE,
    );
    expect(calc.ok).toBe(true);
    if (!calc.ok) return;
    const r = calc.result;
    expect(r.selectedMonthlyIncome).toBe(62500);
    expect(r.monthlySavingAmount).toBe(3125);
    expect(r.totalContribution).toBe(112500);
    expect(r.totalGoldBudget).toBe(56250);
    expect(r.totalSilverBudget).toBe(56250);
    expect(r.estimatedGoldGrams).toBeCloseTo(11.25, 5);
    expect(r.estimatedSilverGrams).toBeCloseTo(1125, 5);
    expect(r.estimatedSilverOz).toBeCloseTo(1125 / SILVER_GRAMS_PER_OUNCE, 5);
    expectAllFinite(r);
  });

  it('case 3: custom salary above 75k is used as the income', () => {
    const calc = calculateSavingPlan(
      inputs({
        salaryRangeKey: 'more_than_75000',
        customSalaryValue: 120000,
        savingPercentage: 10,
      }),
      PRICE,
    );
    expect(calc.ok).toBe(true);
    if (!calc.ok) return;
    expect(calc.result.selectedMonthlyIncome).toBe(120000);
    expect(calc.result.usedCustomSalary).toBe(true);
    expect(calc.result.monthlySavingAmount).toBe(12000);
    expectAllFinite(calc.result);
  });

  it('case 3b: high range without a valid custom value falls back to 90000', () => {
    const calc = calculateSavingPlan(
      inputs({ salaryRangeKey: 'more_than_75000', customSalaryValue: undefined }),
      PRICE,
    );
    expect(calc.ok).toBe(true);
    if (!calc.ok) return;
    expect(calc.result.selectedMonthlyIncome).toBe(90000);
    expect(calc.result.usedCustomSalary).toBe(false);
  });

  it('case 4: custom percentage is applied directly', () => {
    const calc = calculateSavingPlan(inputs({ savingPercentage: 12 }), PRICE);
    expect(calc.ok).toBe(true);
    if (!calc.ok) return;
    expect(calc.result.monthlySavingAmount).toBe(3300);
    expectAllFinite(calc.result);
  });

  it('case 5: gold goal with silver-only allocation returns a gold mismatch', () => {
    const calc = calculateSavingPlan(
      inputs({ goal: 'gold_1g', allocationKey: 'silver' }),
      PRICE,
    );
    expect(calc.ok).toBe(true);
    if (!calc.ok) return;
    expect(calc.result.goalProgress.kind).toBe('metal_missing');
    if (calc.result.goalProgress.kind === 'metal_missing') {
      expect(calc.result.goalProgress.metal).toBe('gold');
    }
  });

  it('case 6: silver goal with gold-only allocation returns a silver mismatch', () => {
    const calc = calculateSavingPlan(
      inputs({ goal: 'silver_1oz', allocationKey: 'gold' }),
      PRICE,
    );
    expect(calc.ok).toBe(true);
    if (!calc.ok) return;
    expect(calc.result.goalProgress.kind).toBe('metal_missing');
    if (calc.result.goalProgress.kind === 'metal_missing') {
      expect(calc.result.goalProgress.metal).toBe('silver');
    }
  });

  it('computes months-to-goal for a reachable gold goal', () => {
    const calc = calculateSavingPlan(
      inputs({ goal: 'gold_1g', allocationKey: 'gold' }),
      PRICE,
    );
    expect(calc.ok).toBe(true);
    if (!calc.ok) return;
    // 1g * 5000 / 2750 monthly = 1.818 → ceil = 2 months
    expect(calc.result.goalProgress.kind).toBe('months_to_goal');
    if (calc.result.goalProgress.kind === 'months_to_goal') {
      expect(calc.result.goalProgress.monthsToGoal).toBe(2);
    }
  });

  it('case 7: invalid/unavailable price does not fabricate results', () => {
    const badPrice: MetalPrice = {
      goldPricePerGram: 0,
      silverPricePerGram: 50,
      sourceLabel: 'config_reference',
    };
    const calc = calculateSavingPlan(inputs(), badPrice);
    expect(calc.ok).toBe(false);
    if (calc.ok) return;
    expect(typeof calc.error).toBe('string');
    expect(calc.error.length).toBeGreaterThan(0);
  });

  it('case 8: safeDivide prevents division-by-zero and non-finite output', () => {
    expect(safeDivide(10, 0)).toBe(0);
    expect(safeDivide(10, Number.NaN)).toBe(0);
    expect(safeDivide(Number.POSITIVE_INFINITY, 2)).toBe(0);
    expect(safeDivide(10, Number.POSITIVE_INFINITY)).toBe(0);
    expect(safeDivide(33000, 5000)).toBeCloseTo(6.6, 5);
  });

  it('case 9: no NaN/Infinity across mixed allocations and goals', () => {
    const scenarios: PlanInputs[] = [
      inputs({ allocationKey: 'gold70_silver30', goal: 'preserve_value' }),
      inputs({ allocationKey: 'gold30_silver70', goal: 'silver_500g_receipt' }),
      inputs({
        salaryRangeKey: 'less_than_10000',
        savingPercentage: 5,
        durationMonths: 6,
        allocationKey: 'gold50_silver50',
        goal: 'long_term',
      }),
      inputs({
        salaryRangeKey: 'more_than_75000',
        customSalaryValue: 250000,
        savingPercentage: 20,
        durationMonths: 60,
        allocationKey: 'silver',
        goal: 'gold_5g_delivery',
      }),
    ];
    for (const scenario of scenarios) {
      const calc = calculateSavingPlan(scenario, PRICE);
      expect(calc.ok).toBe(true);
      if (calc.ok) expectAllFinite(calc.result);
    }
  });
});
