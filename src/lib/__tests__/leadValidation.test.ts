import { describe, expect, it } from 'vitest';
import {
  normalizeEgyptMobile,
  validateLeadMobile,
  validateLeadName,
} from '../leadValidation';

describe('validateLeadName', () => {
  it('accepts Arabic and Latin names', () => {
    expect(validateLeadName('محمد علي').ok).toBe(true);
    expect(validateLeadName('Ahmed Hassan').ok).toBe(true);
    expect(validateLeadName('  سارة  ').ok).toBe(true);
  });

  it('rejects empty, too-short, or non-letter names', () => {
    expect(validateLeadName('').ok).toBe(false);
    expect(validateLeadName('A').ok).toBe(false);
    expect(validateLeadName('12345').ok).toBe(false);
    expect(validateLeadName('محمد123').ok).toBe(false);
  });
});

describe('normalizeEgyptMobile', () => {
  it('normalises country-code and separator variants to local form', () => {
    expect(normalizeEgyptMobile('+20 101 234 5678')).toBe('01012345678');
    expect(normalizeEgyptMobile('00201012345678')).toBe('01012345678');
    expect(normalizeEgyptMobile('1012345678')).toBe('01012345678');
    expect(normalizeEgyptMobile('010-1234-5678')).toBe('01012345678');
  });
});

describe('validateLeadMobile', () => {
  it('accepts valid Egyptian mobile prefixes', () => {
    expect(validateLeadMobile('01012345678').ok).toBe(true);
    expect(validateLeadMobile('01112345678').ok).toBe(true);
    expect(validateLeadMobile('01212345678').ok).toBe(true);
    expect(validateLeadMobile('01512345678').ok).toBe(true);
    expect(validateLeadMobile('+201012345678')).toEqual({
      ok: true,
      value: '01012345678',
    });
  });

  it('rejects invalid prefixes, lengths, and non-numeric input', () => {
    expect(validateLeadMobile('01312345678').ok).toBe(false); // 013 not valid
    expect(validateLeadMobile('0101234567').ok).toBe(false); // too short
    expect(validateLeadMobile('010123456789').ok).toBe(false); // too long
    expect(validateLeadMobile('abcdefghijk').ok).toBe(false);
    expect(validateLeadMobile('').ok).toBe(false);
  });
});
