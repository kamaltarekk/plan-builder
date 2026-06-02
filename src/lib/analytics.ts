// Lightweight, no-op-safe analytics wrapper. If no `window.dataLayer`
// (GTM-style) is present, every call is a silent no-op and never throws,
// so analytics can never break the feature.

export type SavingPlanEvent =
  | 'saving_plan_started'
  | 'saving_plan_salary_range_selected'
  | 'saving_plan_percentage_selected'
  | 'saving_plan_goal_selected'
  | 'saving_plan_duration_selected'
  | 'saving_plan_allocation_selected'
  | 'saving_plan_generated'
  | 'saving_plan_cta_clicked'
  | 'saving_plan_reset_clicked'
  | 'saving_plan_copy_clicked';

const SOURCE = 'saving_plan_tool';

export function track(
  event: SavingPlanEvent,
  payload: Record<string, unknown> = {},
): void {
  try {
    if (typeof window === 'undefined' || !Array.isArray(window.dataLayer)) {
      return;
    }
    window.dataLayer.push({ event, source: SOURCE, ...payload });
  } catch {
    // Intentionally swallowed — analytics must never break the feature.
  }
}

/** Buckets a monthly amount so we never emit raw saving figures. */
export function monthlySavingBucket(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return 'unknown';
  if (amount < 500) return 'lt_500';
  if (amount < 1000) return '500_1000';
  if (amount < 2500) return '1000_2500';
  if (amount < 5000) return '2500_5000';
  if (amount < 10000) return '5000_10000';
  return 'gte_10000';
}
