import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlanDisclaimer from './PlanDisclaimer';
import { SABIKA_INSTALL_URL } from '@/lib/constants';
import {
  COPY,
  DURATION_LABELS,
  GOAL_LABELS,
} from '@/lib/savingPlanContent';
import {
  formatCurrencyEGP,
  formatGram,
  formatMonths,
  formatOunce,
  formatTimestamp,
} from '@/lib/savingPlanFormatting';
import type { MetalPrice, PlanResult } from '@/lib/savingPlanTypes';

interface ResultCardsProps {
  result: PlanResult;
  price: MetalPrice;
  onCtaClick: () => void;
  onEditClick: () => void;
  onCopyClick: () => void;
}

function equivalentText(result: PlanResult): string {
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

function goalText(result: PlanResult): string {
  const { goalProgress } = result;
  switch (goalProgress.kind) {
    case 'behavioral':
    case 'metal_missing':
      return goalProgress.message;
    case 'months_to_goal':
      return COPY.result.monthsToGoal(formatMonths(goalProgress.monthsToGoal));
  }
}

function buildSummary(result: PlanResult): string {
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

export default function ResultCards({
  result,
  price,
  onCtaClick,
  onEditClick,
  onCopyClick,
}: ResultCardsProps) {
  const [copied, setCopied] = useState(false);

  const incomeText = formatCurrencyEGP(result.selectedMonthlyIncome);
  const intro = result.usedCustomSalary
    ? COPY.result.introCustom(incomeText)
    : COPY.result.introByRange(incomeText);
  const durationLabel = DURATION_LABELS[result.durationMonths];
  const updatedAt = formatTimestamp(price.updatedAt);

  async function handleCopy() {
    onCopyClick();
    if (!navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(buildSummary(result));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be blocked; fail silently without breaking the UI.
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-base leading-7 text-sabika-ink-soft">{intro}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="text-sm font-medium text-sabika-silver">
            {COPY.result.cards.monthly}
          </h3>
          <p className="mt-2 text-2xl font-bold text-sabika-ink">
            {formatCurrencyEGP(result.monthlySavingAmount)}
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-sabika-silver">
            {COPY.result.cards.total}
          </h3>
          <p className="mt-2 text-2xl font-bold text-sabika-ink">
            {formatCurrencyEGP(result.totalContribution)}
          </p>
          <p className="mt-1 text-sm text-sabika-silver">
            {COPY.result.totalSuffix(durationLabel)}
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-sabika-silver">
            {COPY.result.cards.equivalent}
          </h3>
          <p className="mt-2 text-xl font-bold text-sabika-gold-dark">
            {equivalentText(result)}
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-sabika-silver">
            {COPY.result.cards.goal}
          </h3>
          <p className="mt-2 text-base font-semibold text-sabika-ink">
            {GOAL_LABELS[result.goal]}
          </p>
          <p className="mt-1 text-sm leading-6 text-sabika-ink-soft">
            {goalText(result)}
          </p>
        </Card>
      </div>

      <Card className="bg-sabika-ink text-white">
        <h3 className="text-sm font-medium text-sabika-gold-light">
          {COPY.result.cards.next}
        </h3>
        <p className="mt-2 text-lg font-bold">{COPY.result.nextStepLead}</p>
        <a
          href={SABIKA_INSTALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCtaClick}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-sabika-gold px-5 py-3 text-base font-semibold text-sabika-ink transition-colors duration-150 hover:bg-sabika-gold-dark hover:text-white sm:w-auto"
        >
          {COPY.cta.install}
        </a>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" onClick={onEditClick} className="sm:flex-1">
          {COPY.cta.edit}
        </Button>
        <Button variant="ghost" onClick={handleCopy} className="sm:flex-1">
          {copied ? COPY.cta.copied : COPY.cta.copy}
        </Button>
      </div>

      <div className="space-y-1 border-t border-sabika-silver-light pt-4">
        <p className="text-sm text-sabika-ink-soft">{COPY.result.priceSource}</p>
        {updatedAt ? (
          <p className="text-xs text-sabika-silver">
            {COPY.result.priceUpdatedPrefix} {updatedAt}
          </p>
        ) : null}
      </div>

      <PlanDisclaimer />
    </div>
  );
}
