import { COPY, DURATION_LABELS, GOAL_LABELS } from '@/lib/savingPlanContent';
import { formatCurrencyEGP, formatTimestamp } from '@/lib/savingPlanFormatting';
import { equivalentText, goalText } from '@/lib/savingPlanSummary';
import type { MetalPrice, PlanResult } from '@/lib/savingPlanTypes';

interface PdfPlanTemplateProps {
  result: PlanResult;
  price: MetalPrice;
  installUrl: string;
}

// Brand colours inlined so html2canvas renders identically regardless of CSS.
const C = {
  gold: '#C9A227',
  goldDark: '#9C7C12',
  ink: '#15131F',
  inkSoft: '#262338',
  silver: '#8E97A6',
  silverLight: '#E4E7EC',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
        padding: '12px 0',
        borderBottom: `1px solid ${C.silverLight}`,
      }}
    >
      <span style={{ color: C.silver, fontSize: 14, fontWeight: 600 }}>
        {label}
      </span>
      <span
        style={{
          color: C.ink,
          fontSize: 16,
          fontWeight: 700,
          textAlign: 'left',
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function PdfPlanTemplate({
  result,
  price,
  installUrl,
}: PdfPlanTemplateProps) {
  const incomeText = formatCurrencyEGP(result.selectedMonthlyIncome);
  const intro = result.usedCustomSalary
    ? COPY.result.introCustom(incomeText)
    : COPY.result.introByRange(incomeText);
  const durationLabel = DURATION_LABELS[result.durationMonths];
  const updatedAt = formatTimestamp(price.updatedAt);

  return (
    <div
      dir="rtl"
      data-pdf-root
      style={{
        width: 700,
        boxSizing: 'border-box',
        background: '#ffffff',
        color: C.ink,
        fontFamily: "'Cairo', system-ui, sans-serif",
        padding: 32,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `3px solid ${C.gold}`,
          paddingBottom: 16,
          marginBottom: 20,
        }}
      >
        <div>
          {/* Brand mark — swap for the official logo image when provided. */}
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: C.goldDark,
              lineHeight: 1,
            }}
          >
            {COPY.pdf.brand}
          </div>
          <div style={{ fontSize: 13, color: C.silver, marginTop: 6 }}>
            {COPY.pdf.subtitle}
          </div>
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.ink,
            maxWidth: 360,
            textAlign: 'left',
          }}
        >
          {COPY.pdf.title}
        </div>
      </div>

      <p
        style={{
          fontSize: 15,
          lineHeight: 1.8,
          color: C.inkSoft,
          margin: '0 0 16px',
        }}
      >
        {intro}
      </p>

      <div>
        <Row
          label={COPY.result.cards.monthly}
          value={formatCurrencyEGP(result.monthlySavingAmount)}
        />
        <Row
          label={COPY.result.cards.total}
          value={`${formatCurrencyEGP(result.totalContribution)} ${COPY.result.totalSuffix(durationLabel)}`}
        />
        <Row
          label={COPY.result.cards.equivalent}
          value={equivalentText(result)}
        />
        <Row
          label={COPY.result.cards.goal}
          value={`${GOAL_LABELS[result.goal]} — ${goalText(result)}`}
        />
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <div
          data-pdf-cta
          style={{
            display: 'inline-block',
            background: C.gold,
            color: C.ink,
            fontWeight: 800,
            fontSize: 16,
            padding: '12px 28px',
            borderRadius: 12,
          }}
        >
          {COPY.pdf.ctaButton}
        </div>
        <div style={{ fontSize: 12, color: C.silver, marginTop: 8 }}>
          {COPY.pdf.ctaHint}
        </div>
        <div style={{ fontSize: 12, color: C.goldDark, marginTop: 2 }}>
          {installUrl}
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          paddingTop: 12,
          borderTop: `1px solid ${C.silverLight}`,
        }}
      >
        <div style={{ fontSize: 12, color: C.inkSoft }}>
          {COPY.result.priceSource}
        </div>
        {updatedAt ? (
          <div style={{ fontSize: 11, color: C.silver, marginTop: 2 }}>
            {COPY.result.priceUpdatedPrefix} {updatedAt}
          </div>
        ) : null}
      </div>

      <p
        style={{
          fontSize: 11,
          lineHeight: 1.7,
          color: C.silver,
          margin: '12px 0 0',
        }}
      >
        {COPY.result.disclaimer}
      </p>
    </div>
  );
}
