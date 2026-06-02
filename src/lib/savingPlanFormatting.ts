import { COPY, SAFE_VALUE_PLACEHOLDER } from './savingPlanContent';

// Arabic locale with Latin digits keeps the whole tool numerically
// consistent and easy to read for a finance audience.
const LOCALE = 'ar-EG';

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function formatWith(value: number, options: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE, {
    numberingSystem: 'latn',
    ...options,
  }).format(value);
}

/** Formats an integer-ish count. Never returns NaN/Infinity to the UI. */
export function formatNumber(value: number, fractionDigits = 0): string {
  if (!isFiniteNumber(value)) return SAFE_VALUE_PLACEHOLDER;
  return formatWith(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
}

/** Formats an EGP amount, rounded to whole pounds, with the جنيه suffix. */
export function formatCurrencyEGP(value: number): string {
  if (!isFiniteNumber(value)) return SAFE_VALUE_PLACEHOLDER;
  const rounded = Math.round(value);
  return `${formatWith(rounded, { maximumFractionDigits: 0 })} ${COPY.units.egp}`;
}

/** Formats a gram quantity with up to two decimals and the جرام suffix. */
export function formatGram(value: number): string {
  if (!isFiniteNumber(value)) return SAFE_VALUE_PLACEHOLDER;
  return `${formatWith(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ${COPY.units.gram}`;
}

/** Formats an ounce quantity with up to two decimals and the أونصة suffix. */
export function formatOunce(value: number): string {
  if (!isFiniteNumber(value)) return SAFE_VALUE_PLACEHOLDER;
  return `${formatWith(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ${COPY.units.ounce}`;
}

/** Formats a month count as e.g. "12 شهر". */
export function formatMonths(value: number): string {
  if (!isFiniteNumber(value)) return SAFE_VALUE_PLACEHOLDER;
  return `${formatWith(value, { maximumFractionDigits: 0 })} شهر`;
}

/** Formats an ISO timestamp for the "آخر تحديث للسعر" line, or null if invalid. */
export function formatTimestamp(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(LOCALE, {
    numberingSystem: 'latn',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
