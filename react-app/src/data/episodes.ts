export interface Episode {
  slug: string;
  title: string;
  category: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  imageAlt: string;
  featured?: boolean;
}

export const episodes: Episode[] = [
  {
    slug: 'the-pastors-kid',
    title: "The Pastor's Kid",
    category: 'Faith & Family',
    description:
      'A spoken-word episode from the Walking Shadow Poetry YouTube archive. Press play for the full piece.',
    youtubeId: 'SQKmNTXhdvk',
    thumbnail: '/media/episodes/the-pastors-kid.webp',
    imageAlt: 'The Pastor’s Kid — a Walking Shadow Poetry spoken-word episode',
    featured: true,
  },
  {
    slug: 'the-life-script',
    title: 'The Life Script',
    category: 'Purpose',
    description:
      'A Walking Shadow Poetry spoken-word episode about the script of a life, published on YouTube.',
    youtubeId: 'f7FhOV2KBg4',
    thumbnail: '/media/episodes/the-life-script.webp',
    imageAlt: 'The Life Script — a Walking Shadow Poetry spoken-word episode',
  },
  {
    slug: 'god-knows-why',
    title: 'God Knows Why',
    category: 'Faith',
    description:
      'A Walking Shadow Poetry spoken-word episode on faith and the questions we carry.',
    youtubeId: 'NFUMeq6xGuk',
    thumbnail: '/media/episodes/god-knows-why.webp',
    imageAlt: 'God Knows Why — a Walking Shadow Poetry spoken-word episode',
  },
  {
    slug: 'one-word-for-the-people',
    title: 'One Word for the People',
    category: 'Spoken Word',
    description:
      'A short spoken-word message from Walking Shadow Poetry, shared on YouTube.',
    youtubeId: 'kf3IqMA3xbI',
    thumbnail: '/media/episodes/one-word-for-the-people.webp',
    imageAlt: 'One Word for the People — a Walking Shadow Poetry spoken-word episode',
  },
  {
    slug: 'you-are-a-hero',
    title: 'You are a Hero',
    category: 'Performance',
    description:
      '“Some of us grew up thinking that our heroes are our dads and moms…” A Nakuru performance about the heroes among us.',
    youtubeId: 'axwF00RH97c',
    thumbnail: '/media/episodes/you-are-a-hero.webp',
    imageAlt: 'You are a Hero — a Walking Shadow Poetry performance in Nakuru',
  },
  {
    slug: 'walk-alone',
    title: 'Walk Alone',
    category: 'Resilience',
    description:
      '“I walked alone in this path, had no one to call my own…” A performance about solitude, endurance and finding a way forward.',
    youtubeId: '8UaPo7daicg',
    thumbnail: '/media/episodes/walk-alone.webp',
    imageAlt: 'Walk Alone — a Walking Shadow Poetry performance in Nakuru',
  },
  {
    slug: 'expect-anything-from-anyone',
    title: 'Expect Anything from Anyone',
    category: 'Relationships',
    description:
      '“The person you trust most can betray you, the people you love most can hate you…” A performance about trust and its lessons.',
    youtubeId: 'm9upy32Yo2Y',
    thumbnail: '/media/episodes/expect-anything-from-anyone.webp',
    imageAlt: 'Expect Anything from Anyone — a Walking Shadow Poetry performance',
  },
];

export const episodeCategories = Array.from(new Set(episodes.map((e) => e.category)));
