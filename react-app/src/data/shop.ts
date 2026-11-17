export interface ShopCategory {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  href: string;
  kind: 'clothing' | 'personalized';
}

export const shopCategories: ShopCategory[] = [
  {
    slug: 't-shirts',
    name: 'T-shirts',
    tagline: 'Wear the words',
    description: 'Heavyweight cotton tees printed with lines from the Walking Shadow archive.',
    image: '/media/shop/shop-poster.webp',
    href: '/shop/categories/t-shirts',
    kind: 'clothing',
  },
  {
    slug: 'hoodies',
    name: 'Hoodies',
    tagline: 'Warmth for the work',
    description: 'Brushed fleece hoodies embroidered with the motto and wordmark.',
    image: '/media/gallery/artist-05.webp',
    href: '/shop/categories/hoodies',
    kind: 'clothing',
  },
  {
    slug: 'sweatshirts',
    name: 'Sweatshirts',
    tagline: 'Everyday armour',
    description: 'Midweight crewnecks for slow mornings and long evenings.',
    image: '/media/gallery/artist-09.webp',
    href: '/shop/categories/sweatshirts',
    kind: 'clothing',
  },
  {
    slug: 'caps',
    name: 'Caps',
    tagline: 'Finish the look',
    description: 'Six-panel caps with a woven Walking Shadow label.',
    image: '/media/gallery/artist-12.webp',
    href: '/shop/categories/caps',
    kind: 'clothing',
  },
  {
    slug: 'personalized-notes',
    name: 'Personalized Notes',
    tagline: 'Words, made personal',
    description: 'Handwritten-style notes written for a person, an occasion and a feeling.',
    image: '/media/poetry/dear-mom.webp',
    href: '/shop/personalized/notes',
    kind: 'personalized',
  },
  {
    slug: 'poetry-commissions',
    name: 'Poetry Commissions',
    tagline: 'Commissioned work',
    description: 'Bespoke poems composed for the milestones that deserve their own words.',
    image: '/media/poetry/my-love-poem.webp',
    href: '/shop/commissions',
    kind: 'personalized',
  },
];

export const clothingCategories = shopCategories.filter((category) => category.kind === 'clothing');

export const occasions = [
  'Birthday',
  'Anniversary',
  'Wedding',
  "Valentine's Day",
  "Mother's Day",
  "Father's Day",
  'Graduation',
  'Appreciation',
  'Apology',
  'Memorial',
  'Friendship',
  'Romantic Gift',
  'Other',
] as const;

export const relationships = [
  'Partner',
  'Spouse',
  'Mother',
  'Father',
  'Child',
  'Sibling',
  'Friend',
  'Grandparent',
  'Colleague',
  'Mentor',
  'Other',
] as const;

export const yesNoOptions = ['No', 'Yes'] as const;

export const writingTones = [
  'Romantic',
  'Emotional',
  'Heartfelt',
  'Poetic',
  'Playful',
  'Inspirational',
  'Formal',
] as const;

export const noteLengths = [
  'Short (2–4 lines)',
  'Medium (5–8 lines)',
  'Long (9–16 lines)',
  'Extended (17+ lines)',
] as const;

export const deliveryFormats = ['Digital (PDF)', 'Printed & posted'] as const;

export const poetryTypes = [
  'Free verse',
  'Spoken word',
  'Rhyming poem',
  'Prose poem',
  'Acrostic',
  'Sonnet',
  'Not sure — advise me',
] as const;

export const commissionLengths = [
  'Short piece (up to 8 lines)',
  'Standard piece (9–20 lines)',
  'Long piece (21–40 lines)',
  'Extended / performance piece (40+ lines)',
] as const;

export const kenyanCounties = [
  'Nairobi',
  'Nakuru',
  'Mombasa',
  'Kisumu',
  'Kiambu',
  'Machakos',
  'Kajiado',
  'Uasin Gishu',
  'Nyeri',
  'Meru',
  'Kakamega',
  'Bungoma',
  'Kilifi',
  'Kericho',
  'Bomet',
  'Narok',
  'Laikipia',
  'Nyandarua',
  'Murang’a',
  'Embu',
  'Kitui',
  'Garissa',
  'Turkana',
  'Other',
] as const;

export const sortOptions = [
  { value: 'date-desc', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'popularity-desc', label: 'Most popular' },
  { value: 'title-asc', label: 'Alphabetical' },
] as const;

export const priceBands = [
  { value: '', label: 'All prices' },
  { value: '0-2500', label: 'Under KSh 2,500' },
  { value: '2500-5000', label: 'KSh 2,500 – 5,000' },
  { value: '5000-8000', label: 'KSh 5,000 – 8,000' },
  { value: '8000-99999', label: 'KSh 8,000 and above' },
] as const;
