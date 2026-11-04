export interface Performance {
  slug: string;
  title: string;
  date: string;
  dateISO?: string;
  location: string;
  description: string;
  image: string;
  imageAlt: string;
  youtubeId?: string;
  externalUrl?: string;
  status: 'past' | 'upcoming';
  featured?: boolean;
}

export const upcomingPerformances: Performance[] = [];

export const pastPerformances: Performance[] = [
  {
    slug: 'you-are-a-hero',
    title: 'You are a Hero',
    date: '20 October',
    location: 'Nakuru, Kenya',
    description:
      'Some of us grew up thinking that our heroes are our dads and moms. A performance celebrating the quiet heroism of ordinary people.',
    image: '/media/events/you-are-a-hero.webp',
    imageAlt: 'A Walking Shadow Poetry performance of You are a Hero in Nakuru',
    youtubeId: 'axwF00RH97c',
    status: 'past',
    featured: true,
  },
  {
    slug: 'walk-alone',
    title: 'Walk Alone',
    date: '12 January',
    location: 'Nakuru, Kenya',
    description:
      'I walked alone in this path, had no one to call my own, life was tough and smile was a mask. A performance about solitude and finding your way.',
    image: '/media/events/walk-alone.webp',
    imageAlt: 'A Walking Shadow Poetry performance of Walk Alone in Nakuru',
    youtubeId: '8UaPo7daicg',
    status: 'past',
  },
  {
    slug: 'expect-anything-from-anyone',
    title: 'Expect Anything from Anyone',
    date: '31 October',
    location: 'Nakuru, Kenya',
    description:
      'The person you trust most can betray you, the people you love most can hate you. A performance about trust, disappointment and the lessons that follow.',
    image: '/media/events/expect-anything.webp',
    imageAlt: 'A Walking Shadow Poetry performance of Expect Anything from Anyone',
    youtubeId: 'm9upy32Yo2Y',
    status: 'past',
  },
  {
    slug: 'nakuru-players-theatre',
    title: 'Performance at Nakuru Players Theatre',
    date: '28 January 2021',
    dateISO: '2021-01-28',
    location: 'Nakuru Players Theatre, Nakuru, Kenya',
    description:
      'An early documented performance at Nakuru Players Theatre, shared in the Walking Shadow Poetry archive.',
    image: '/media/gallery/artist-10.webp',
    imageAlt: 'A Walking Shadow Poetry portrait from the performance archive',
    externalUrl: 'https://web.facebook.com/photo.php?fbid=201353765766473',
    status: 'past',
  },
];

export const allPerformances = [...upcomingPerformances, ...pastPerformances];
