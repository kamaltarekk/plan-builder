import { COPY, DURATION_LABELS, GOAL_LABELS } from './savingPlanContent';
import {
  formatCurrencyEGP,
  formatGram,
  formatMonths,
  formatOunce,
} from './savingPlanFormatting';
import type { PlanResult } from './savingPlanTypes';

/** "today's price" equivalent line, conditional on the chosen allocation. */
export function equivalentText(result: PlanResult): string {
  const { allocation } = result;
  const gold = `${formatGram(result.estimatedGoldGrams)} ${COPY.units.gold}`;
  const silver = `${formatGram(result.estimatedSilverGrams)} ${COPY.units.silver}`;
  const ounce = formatOunce(result.estimatedSilverOz);

  if (allocation.silver === 0) {
    return `${gold} ${COPY.units.approx}`;
  }
  if (allocation.gold === 0) {
    return `${silver} / ${ounce} ${COPY.units.approx}`;
  }
  return `${gold} + ${silver} ${COPY.units.approx}`;
}

/** The goal progress / milestone message for the chosen goal. */
export function goalText(result: PlanResult): string {
  const { goalProgress } = result;
  switch (goalProgress.kind) {
    case 'behavioral':
    case 'metal_missing':
      return goalProgress.message;
    case 'months_to_goal':
      return COPY.result.monthsToGoal(formatMonths(goalProgress.monthsToGoal));
  }
}

/** A concise, copy-to-clipboard friendly Arabic summary of the plan. */
export function buildPlanSummary(result: PlanResult): string {
  const durationLabel = DURATION_LABELS[result.durationMonths];
  return [
    COPY.pageTitle,
    `${COPY.result.cards.monthly}: ${formatCurrencyEGP(result.monthlySavingAmount)}`,
    `${COPY.result.cards.total}: ${formatCurrencyEGP(result.totalContribution)} ${COPY.result.totalSuffix(durationLabel)}`,
    `${COPY.result.cards.equivalent}: ${equivalentText(result)}`,
    `${COPY.result.cards.goal}: ${GOAL_LABELS[result.goal]} — ${goalText(result)}`,
    COPY.result.disclaimer,
  ].join('\n');
}
