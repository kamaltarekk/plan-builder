import { describe, expect, it } from 'vitest';
import {
  DEFAULT_REFERENCE_PRICE,
  resolvePriceFromConfig,
} from '../priceProvider';
import { SILVER_GRAMS_PER_OUNCE } from '../savingPlanContent';

describe('resolvePriceFromConfig', () => {
  it('falls back to the built-in reference when nothing is configured', () => {
    const result = resolvePriceFromConfig({});
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.price.goldPricePerGram).toBe(
        DEFAULT_REFERENCE_PRICE.goldPricePerGram,
      );
      expect(result.price.silverPricePerGram).toBe(
        DEFAULT_REFERENCE_PRICE.silverPricePerGram,
      );
      expect(result.price.sourceLabel).toBe('config_reference');
    }
  });

  it('uses valid configured per-gram prices', () => {
    const result = resolvePriceFromConfig({ gold: '6000', silverGram: '80' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.price.goldPricePerGram).toBe(6000);
      expect(result.price.silverPricePerGram).toBe(80);
    }
  });

  it('returns an unavailable state for invalid configured values', () => {
    expect(resolvePriceFromConfig({ gold: 'abc' }).ok).toBe(false);
    expect(resolvePriceFromConfig({ silverGram: '-1' }).ok).toBe(false);
    expect(resolvePriceFromConfig({ silverOunce: '0' }).ok).toBe(false);
  });

  it('converts a per-ounce silver price to per-gram', () => {
    const ounce = 3110.34768;
    const result = resolvePriceFromConfig({ silverOunce: String(ounce) });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.price.silverPricePerGram).toBeCloseTo(
        ounce / SILVER_GRAMS_PER_OUNCE,
        5,
      );
    }
  });

  it('fills missing metals from the reference defaults', () => {
    const result = resolvePriceFromConfig({ gold: '6000' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.price.goldPricePerGram).toBe(6000);
      expect(result.price.silverPricePerGram).toBe(
        DEFAULT_REFERENCE_PRICE.silverPricePerGram,
      );
    }
  });
});
