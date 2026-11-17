import { describe, expect, it } from 'vitest';
import {
  personalizationLimits,
  personalizationSchema,
  toPersonalizationData,
  type PersonalizationValues,
} from './personalization';

const validValues: PersonalizationValues = {
  productId: '74',
  customerName: 'Wanjiku',
  customerEmail: 'wanjiku@example.com',
  customerPhone: '',
  recipientName: 'Amina',
  relationship: 'Friend',
  pronunciation: '',
  occasion: 'Birthday',
  otherOccasion: '',
  message: 'A warm celebration of a long friendship.',
  story: 'We met at university and have celebrated every small win together since then.',
  memories: '',
  importantDetails: '',
  poeticStyle: 'Free verse',
  tone: 'Heartfelt',
  length: 'Medium (5–8 lines)',
  instructions: '',
  surprise: 'no',
  preferredDate: '',
  dedication: 'no',
  dedicationText: '',
  privatePoem: 'no',
  deliveryFormat: 'Digital (PDF)',
};

describe('personalization schema', () => {
  it('accepts a complete submission', () => {
    expect(personalizationSchema.safeParse(validValues).success).toBe(true);
  });

  it('requires details for an Other occasion', () => {
    const result = personalizationSchema.safeParse({ ...validValues, occasion: 'Other' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'otherOccasion')).toBe(true);
    }
  });

  it('requires wording when a dedication is selected', () => {
    const result = personalizationSchema.safeParse({ ...validValues, dedication: 'yes' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'dedicationText')).toBe(true);
    }
  });

  it('rejects values longer than the field limit', () => {
    const result = personalizationSchema.safeParse({
      ...validValues,
      customerName: 'A'.repeat(personalizationLimits.customerName + 1),
    });
    expect(result.success).toBe(false);
  });
});

describe('toPersonalizationData', () => {
  it('maps Other occasions and omits unused dedication wording', () => {
    const data = toPersonalizationData(
      {
        ...validValues,
        occasion: 'Other',
        otherOccasion: 'Retirement',
        dedication: 'no',
        dedicationText: 'Ignored',
      },
      'customized-note',
    );

    expect(data.occasion).toBe('Other: Retirement');
    expect(data.dedicationText).toBe('');
    expect(data.productKind).toBe('customized-note');
  });

  it('keeps dedication wording when requested', () => {
    const data = toPersonalizationData(
      { ...validValues, dedication: 'yes', dedicationText: 'For Amina, always.' },
      'commissioned-poem',
    );

    expect(data.dedicationText).toBe('For Amina, always.');
    expect(data.productKind).toBe('commissioned-poem');
  });
});
