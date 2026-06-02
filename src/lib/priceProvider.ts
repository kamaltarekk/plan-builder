import { COPY, SILVER_GRAMS_PER_OUNCE } from './savingPlanContent';
import { isValidPrice } from './savingPlanValidation';
import type { MetalPrice, PriceResult } from './savingPlanTypes';

/**
 * Built-in reference prices (EGP per gram, 24k gold basis). These are
 * editable config values — NOT live data and NOT placeholders/zeros.
 * Override them with VITE_GOLD_PRICE_PER_GRAM / VITE_SILVER_PRICE_PER_GRAM
 * (or VITE_SILVER_PRICE_PER_OUNCE), or wire a live provider through the
 * same `PriceResult` abstraction.
 */
export const DEFAULT_REFERENCE_PRICE: MetalPrice = {
  goldPricePerGram: 5650,
  silverPricePerGram: 72,
  updatedAt: '2026-06-01T09:00:00+02:00',
  sourceLabel: 'config_reference',
};

export interface RawPriceEnv {
  gold?: string;
  silverGram?: string;
  silverOunce?: string;
  updatedAt?: string;
}

interface ReadResult {
  provided: boolean;
  value: number | null;
}

function readPrice(raw: string | undefined): ReadResult {
  if (raw == null || raw.trim() === '') {
    return { provided: false, value: null };
  }
  const value = Number(raw.trim());
  if (!Number.isFinite(value) || value <= 0) {
    return { provided: true, value: null }; // provided but invalid
  }
  return { provided: true, value };
}

/**
 * Pure resolver: turns raw config strings into a validated price result.
 * - Nothing configured  → built-in reference price.
 * - Configured & valid   → that value (missing metals fall back to reference).
 * - Configured & invalid → graceful unavailable state (no fake fallback).
 */
export function resolvePriceFromConfig(env: RawPriceEnv): PriceResult {
  const goldRead = readPrice(env.gold);
  if (goldRead.provided && goldRead.value == null) {
    return { ok: false, reason: COPY.priceUnavailable };
  }

  const silverGramRead = readPrice(env.silverGram);
  if (silverGramRead.provided && silverGramRead.value == null) {
    return { ok: false, reason: COPY.priceUnavailable };
  }

  let silver: number | null = silverGramRead.value;
  if (silver == null) {
    const ounceRead = readPrice(env.silverOunce);
    if (ounceRead.provided && ounceRead.value == null) {
      return { ok: false, reason: COPY.priceUnavailable };
    }
    if (ounceRead.value != null) {
      silver = ounceRead.value / SILVER_GRAMS_PER_OUNCE;
    }
  }

  const price: MetalPrice = {
    goldPricePerGram: goldRead.value ?? DEFAULT_REFERENCE_PRICE.goldPricePerGram,
    silverPricePerGram: silver ?? DEFAULT_REFERENCE_PRICE.silverPricePerGram,
    updatedAt: env.updatedAt?.trim() || DEFAULT_REFERENCE_PRICE.updatedAt,
    sourceLabel: 'config_reference',
  };

  if (!isValidPrice(price)) {
    return { ok: false, reason: COPY.priceUnavailable };
  }
  return { ok: true, price };
}

/** Reads the reference price from the build-time environment. */
export function getReferencePrice(): PriceResult {
  return resolvePriceFromConfig({
    gold: import.meta.env.VITE_GOLD_PRICE_PER_GRAM,
    silverGram: import.meta.env.VITE_SILVER_PRICE_PER_GRAM,
    silverOunce: import.meta.env.VITE_SILVER_PRICE_PER_OUNCE,
    updatedAt: import.meta.env.VITE_PRICE_UPDATED_AT,
  });
}
