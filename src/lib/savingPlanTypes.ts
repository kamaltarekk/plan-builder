// Core domain types for the Sabika saving-plan tool.
// These are intentionally free of any UI concerns.

export type SalaryRangeKey =
  | 'less_than_10000'
  | '10000_20000'
  | '20000_35000'
  | '35000_50000'
  | '50000_75000'
  | 'more_than_75000';

export type GoalKey =
  | 'monthly_habit'
  | 'preserve_value'
  | 'gold_1g'
  | 'gold_5g_delivery'
  | 'silver_1oz'
  | 'silver_500g_receipt'
  | 'long_term';

export type DurationMonths = 6 | 12 | 36 | 60;

export type AllocationKey =
  | 'gold'
  | 'silver'
  | 'gold70_silver30'
  | 'gold50_silver50'
  | 'gold30_silver70';

export interface Allocation {
  /** Gold share as a percentage (0..100). */
  gold: number;
  /** Silver share as a percentage (0..100). */
  silver: number;
}

export type PriceSourceLabel = 'sabika_reference' | 'config_reference';

export interface MetalPrice {
  goldPricePerGram: number;
  silverPricePerGram: number;
  updatedAt?: string;
  sourceLabel: PriceSourceLabel;
}

export type PriceResult =
  | { ok: true; price: MetalPrice }
  | { ok: false; reason: string };

export interface PlanInputs {
  salaryRangeKey: SalaryRangeKey;
  /** Only meaningful for the `more_than_75000` range. */
  customSalaryValue?: number;
  /** Resolved numeric saving percentage (1..50). */
  savingPercentage: number;
  goal: GoalKey;
  durationMonths: DurationMonths;
  allocationKey: AllocationKey;
}

export type GoalProgress =
  | { kind: 'behavioral'; message: string }
  | { kind: 'metal_missing'; metal: 'gold' | 'silver'; message: string }
  | {
      kind: 'months_to_goal';
      metal: 'gold' | 'silver';
      monthsToGoal: number;
      goalLabel: string;
    };

export interface PlanResult {
  selectedMonthlyIncome: number;
  usedCustomSalary: boolean;
  monthlySavingAmount: number;
  totalContribution: number;
  monthlyGoldBudget: number;
  monthlySilverBudget: number;
  totalGoldBudget: number;
  totalSilverBudget: number;
  estimatedGoldGrams: number;
  estimatedSilverGrams: number;
  estimatedSilverOz: number;
  allocation: Allocation;
  goal: GoalKey;
  durationMonths: DurationMonths;
  goalProgress: GoalProgress;
}

export type CalculationResult =
  | { ok: true; result: PlanResult }
  | { ok: false; error: string };
