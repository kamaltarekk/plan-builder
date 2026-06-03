import { describe, expect, it } from 'vitest';
import {
  affordabilityMessage,
  isValidPrice,
  validateCustomPercentage,
  validateCustomSalary,
  validatePlanInputs,
  type PlanDraft,
} from '../savingPlanValidation';
import { COPY } from '../savingPlanContent';
import type { MetalPrice } from '../savingPlanTypes';

describe('validateCustomSalary', () => {
  it('accepts a valid salary at or above the minimum', () => {
    expect(validateCustomSalary('90000')).toEqual({ ok: true, value: 90000 });
    expect(validateCustomSalary('75,000')).toEqual({ ok: true, value: 75000 });
  });

  it('rejects values below the minimum, including negatives', () => {
    expect(validateCustomSalary('70000').ok).toBe(false);
    expect(validateCustomSalary('-5000').ok).toBe(false);
  });

  it('rejects values above the maximum', () => {
    expect(validateCustomSalary('2000000').ok).toBe(false);
  });

  it('rejects NaN and Infinity', () => {
    expect(validateCustomSalary('abc').ok).toBe(false);
    expect(validateCustomSalary('').ok).toBe(false);
    expect(validateCustomSalary('Infinity').ok).toBe(false);
  });
});

describe('validateCustomPercentage', () => {
  it('accepts values within 1..50', () => {
    expect(validateCustomPercentage('12')).toEqual({ ok: true, value: 12 });
    expect(validateCustomPercentage('1').ok).toBe(true);
    expect(validateCustomPercentage('50').ok).toBe(true);
  });

  it('rejects out-of-range, negative, and non-numeric values', () => {
    expect(validateCustomPercentage('0').ok).toBe(false);
    expect(validateCustomPercentage('51').ok).toBe(false);
    expect(validateCustomPercentage('-3').ok).toBe(false);
    expect(validateCustomPercentage('abc').ok).toBe(false);
  });
});

describe('isValidPrice', () => {
  const base: MetalPrice = {
    goldPricePerGram: 5000,
    silverPricePerGram: 50,
    sourceLabel: 'config_reference',
  };

  it('accepts positive finite prices', () => {
    expect(isValidPrice(base)).toBe(true);
  });

  it('rejects zero, negative, NaN, null, and undefined', () => {
    expect(isValidPrice({ ...base, goldPricePerGram: 0 })).toBe(false);
    expect(isValidPrice({ ...base, silverPricePerGram: -1 })).toBe(false);
    expect(isValidPrice({ ...base, goldPricePerGram: Number.NaN })).toBe(false);
    expect(isValidPrice(null)).toBe(false);
    expect(isValidPrice(undefined)).toBe(false);
  });
});

describe('affordabilityMessage', () => {
  it('returns the right band per percentage', () => {
    expect(affordabilityMessage(5)).toBe(COPY.affordability.calm);
    expect(affordabilityMessage(8)).toBe(COPY.affordability.balanced);
    expect(affordabilityMessage(15)).toBe(COPY.affordability.faster);
    expect(affordabilityMessage(25)).toBe(COPY.affordability.heavy);
  });
});

describe('validatePlanInputs', () => {
  const completeDraft: PlanDraft = {
    salaryRangeKey: '20000_35000',
    customSalaryValue: null,
    savingPercentage: 10,
    goal: 'monthly_habit',
    durationMonths: 12,
    allocationKey: 'gold',
  };

  it('returns typed inputs when the draft is complete and valid', () => {
    const result = validatePlanInputs(completeDraft);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.inputs.savingPercentage).toBe(10);
      expect(result.inputs.salaryRangeKey).toBe('20000_35000');
    }
  });

  it('collects errors when required selections are missing', () => {
    const result = validatePlanInputs({
      salaryRangeKey: null,
      customSalaryValue: null,
      savingPercentage: null,
      goal: null,
      durationMonths: null,
      allocationKey: null,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('rejects an out-of-range percentage', () => {
    const result = validatePlanInputs({ ...completeDraft, savingPercentage: 80 });
    expect(result.ok).toBe(false);
  });
});
