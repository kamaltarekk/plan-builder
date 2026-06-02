import { describe, expect, it } from 'vitest';
import {
  formatCurrencyEGP,
  formatGram,
  formatMonths,
  formatNumber,
  formatOunce,
  formatTimestamp,
} from '../savingPlanFormatting';
import { COPY, SAFE_VALUE_PLACEHOLDER } from '../savingPlanContent';

describe('formatting guards against non-finite values', () => {
  it('returns the safe placeholder for NaN/Infinity', () => {
    expect(formatNumber(Number.NaN)).toBe(SAFE_VALUE_PLACEHOLDER);
    expect(formatCurrencyEGP(Number.POSITIVE_INFINITY)).toBe(
      SAFE_VALUE_PLACEHOLDER,
    );
    expect(formatGram(Number.NEGATIVE_INFINITY)).toBe(SAFE_VALUE_PLACEHOLDER);
    expect(formatOunce(Number.NaN)).toBe(SAFE_VALUE_PLACEHOLDER);
    expect(formatMonths(Number.NaN)).toBe(SAFE_VALUE_PLACEHOLDER);
  });
});

describe('formatting produces expected units', () => {
  it('formats currency, grams and ounces with their suffixes', () => {
    expect(formatCurrencyEGP(2750)).toContain(COPY.units.egp);
    expect(formatGram(6.6)).toContain(COPY.units.gram);
    expect(formatOunce(1.5)).toContain(COPY.units.ounce);
    expect(formatMonths(12)).toContain('شهر');
  });

  it('formats a finite number without returning the placeholder', () => {
    const out = formatNumber(1234);
    expect(out).not.toBe(SAFE_VALUE_PLACEHOLDER);
    expect(out.length).toBeGreaterThan(0);
  });
});

describe('formatTimestamp', () => {
  it('returns null for missing or invalid input', () => {
    expect(formatTimestamp(undefined)).toBeNull();
    expect(formatTimestamp('not-a-date')).toBeNull();
  });

  it('returns a formatted string for a valid ISO timestamp', () => {
    const out = formatTimestamp('2026-06-01T09:00:00+02:00');
    expect(typeof out).toBe('string');
    expect((out ?? '').length).toBeGreaterThan(0);
  });
});
