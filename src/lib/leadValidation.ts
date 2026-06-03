import type { Validated } from './savingPlanValidation';

// ─── Name ─────────────────────────────────────────────────────
// Letters (any script, so Arabic + Latin) plus spaces and common
// name punctuation; must start with a letter and be at least 3 chars.
export const NAME_REGEX = /^\p{L}[\p{L}\s'’.-]{2,}$/u;

export function validateLeadName(raw: string): Validated<string> {
  const value = raw.trim().replace(/\s+/g, ' ');
  if (value === '') {
    return { ok: false, message: 'اكتب اسمك من فضلك.' };
  }
  if (!NAME_REGEX.test(value)) {
    return { ok: false, message: 'اكتب اسم صحيح (حروف فقط).' };
  }
  return { ok: true, value };
}

// ─── Egyptian mobile ──────────────────────────────────────────
// Local 11-digit form: 01[0|1|2|5] + 8 digits (010/011/012/015).
export const EGYPT_MOBILE_REGEX = /^01[0125][0-9]{8}$/;

/** Normalises common formats (+20 / 0020 / leading-0-less) to local form. */
export function normalizeEgyptMobile(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0020')) {
    digits = digits.slice(4);
  } else if (digits.startsWith('20') && digits.length === 12) {
    digits = digits.slice(2);
  }
  if (digits.length === 10 && digits.startsWith('1')) {
    digits = `0${digits}`;
  }
  return digits;
}

export function validateLeadMobile(raw: string): Validated<string> {
  if (raw.trim() === '') {
    return { ok: false, message: 'اكتب رقم موبايلك من فضلك.' };
  }
  const local = normalizeEgyptMobile(raw);
  if (!EGYPT_MOBILE_REGEX.test(local)) {
    return {
      ok: false,
      message: 'رقم الموبايل لازم يكون رقم مصري صحيح (مثال: 01012345678).',
    };
  }
  return { ok: true, value: local };
}
