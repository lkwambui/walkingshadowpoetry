import { z } from 'zod';
import type { PersonalizationData } from './storeApi';

export const personalizationLimits = {
  customerName: 100,
  customerEmail: 160,
  customerPhone: 40,
  recipientName: 120,
  relationship: 80,
  pronunciation: 120,
  occasion: 80,
  message: 1200,
  story: 3000,
  memories: 2000,
  importantDetails: 1500,
  instructions: 1500,
  dedicationText: 500,
} as const;

export const personalizationSchema = z
  .object({
    productId: z.string().min(1, 'Please choose the piece you would like.'),
    customerName: z
      .string()
      .trim()
      .min(2, 'Please share your name.')
      .max(personalizationLimits.customerName),
    customerEmail: z
      .string()
      .trim()
      .email('Please enter a valid email address.')
      .max(personalizationLimits.customerEmail),
    customerPhone: z.string().trim().max(personalizationLimits.customerPhone).optional().or(z.literal('')),
    recipientName: z
      .string()
      .trim()
      .min(1, 'Please share the recipient’s name.')
      .max(personalizationLimits.recipientName),
    relationship: z
      .string()
      .trim()
      .min(2, 'Please tell us how you know them.')
      .max(personalizationLimits.relationship),
    pronunciation: z.string().trim().max(personalizationLimits.pronunciation).optional().or(z.literal('')),
    occasion: z.string().min(1, 'Please choose an occasion.'),
    otherOccasion: z.string().trim().max(80).optional().or(z.literal('')),
    message: z
      .string()
      .trim()
      .min(20, 'Share at least 20 characters about what the poem should communicate.')
      .max(personalizationLimits.message),
    story: z
      .string()
      .trim()
      .min(30, 'Share at least 30 characters of background so the poem feels personal.')
      .max(personalizationLimits.story),
    memories: z.string().trim().max(personalizationLimits.memories).optional().or(z.literal('')),
    importantDetails: z.string().trim().max(personalizationLimits.importantDetails).optional().or(z.literal('')),
    poeticStyle: z.string().min(1, 'Please choose a preferred style.'),
    tone: z.string().min(1, 'Please choose a preferred tone.'),
    length: z.string().min(1, 'Please choose a preferred length.'),
    instructions: z.string().trim().max(personalizationLimits.instructions).optional().or(z.literal('')),
    surprise: z.enum(['yes', 'no']),
    preferredDate: z.string().trim().optional().or(z.literal('')),
    dedication: z.enum(['yes', 'no']),
    dedicationText: z.string().trim().max(personalizationLimits.dedicationText).optional().or(z.literal('')),
    privatePoem: z.enum(['yes', 'no']),
    deliveryFormat: z.string().min(1, 'Please choose a delivery format.'),
  })
  .superRefine((values, context) => {
    if (values.occasion === 'Other' && !values.otherOccasion?.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['otherOccasion'],
        message: 'Please describe the occasion.',
      });
    }
    if (values.dedication === 'yes' && !values.dedicationText?.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['dedicationText'],
        message: 'Please write the dedication you would like included.',
      });
    }
    if (values.preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(values.preferredDate)) {
      context.addIssue({
        code: 'custom',
        path: ['preferredDate'],
        message: 'Use the date picker to choose a delivery date.',
      });
    }
  });

export type PersonalizationValues = z.infer<typeof personalizationSchema>;

export const personalizationSteps: {
  title: string;
  eyebrow: string;
  fields: (keyof PersonalizationValues)[];
}[] = [
  {
    title: 'The people',
    eyebrow: 'Who it is for',
    fields: [
      'productId',
      'customerName',
      'customerEmail',
      'customerPhone',
      'recipientName',
      'relationship',
      'pronunciation',
    ],
  },
  {
    title: 'The moment',
    eyebrow: 'The story behind it',
    fields: ['occasion', 'otherOccasion', 'message', 'story', 'memories', 'importantDetails'],
  },
  {
    title: 'The poem',
    eyebrow: 'How it should sound',
    fields: ['poeticStyle', 'tone', 'length', 'instructions', 'deliveryFormat'],
  },
  {
    title: 'The finishing touches',
    eyebrow: 'Preferences & review',
    fields: ['surprise', 'preferredDate', 'dedication', 'dedicationText', 'privatePoem'],
  },
];

export const reviewFields: { key: keyof PersonalizationValues; label: string }[] = [
  { key: 'customerName', label: 'Your name' },
  { key: 'customerEmail', label: 'Email' },
  { key: 'customerPhone', label: 'Contact number' },
  { key: 'recipientName', label: 'Recipient' },
  { key: 'relationship', label: 'Relationship' },
  { key: 'pronunciation', label: 'Preferred name / pronunciation' },
  { key: 'occasion', label: 'Occasion' },
  { key: 'otherOccasion', label: 'Occasion details' },
  { key: 'message', label: 'What it should communicate' },
  { key: 'story', label: 'Personal story' },
  { key: 'memories', label: 'Special memories' },
  { key: 'importantDetails', label: 'Details to include' },
  { key: 'poeticStyle', label: 'Poetic style' },
  { key: 'tone', label: 'Tone' },
  { key: 'length', label: 'Length' },
  { key: 'instructions', label: 'Additional instructions' },
  { key: 'deliveryFormat', label: 'Delivery format' },
  { key: 'surprise', label: 'Surprise gift' },
  { key: 'preferredDate', label: 'Preferred delivery date' },
  { key: 'dedication', label: 'Dedication' },
  { key: 'dedicationText', label: 'Dedication wording' },
  { key: 'privatePoem', label: 'Keep private' },
];

export function toPersonalizationData(
  values: PersonalizationValues,
  productKind: PersonalizationData['productKind'],
): PersonalizationData {
  return {
    productKind,
    customerName: values.customerName,
    customerEmail: values.customerEmail,
    customerPhone: values.customerPhone || '',
    recipientName: values.recipientName,
    relationship: values.relationship,
    pronunciation: values.pronunciation || '',
    occasion: values.otherOccasion && values.occasion === 'Other' ? `Other: ${values.otherOccasion}` : values.occasion,
    message: values.message,
    story: values.story,
    memories: values.memories || '',
    importantDetails: values.importantDetails || '',
    poeticStyle: values.poeticStyle,
    tone: values.tone,
    length: values.length,
    instructions: values.instructions || '',
    surprise: values.surprise,
    preferredDate: values.preferredDate || '',
    dedication: values.dedication,
    dedicationText: values.dedication === 'yes' ? values.dedicationText : '',
    privatePoem: values.privatePoem,
    deliveryFormat: values.deliveryFormat,
  };
}
