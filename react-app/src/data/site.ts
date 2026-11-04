export const site = {
  name: 'Walking Shadow Poetry',
  tagline: 'Art from the Heart',
  slogan: "Grow from what's meant to kill you",
  description:
    'A platform where words take you on a journey and give resilience a voice.',
  longDescription:
    'Walking Shadow Poetry is a spoken-word and storytelling platform based in Nakuru, Kenya. Through poetry, performance and creative collaboration, we remind people of their ability to grow from what is meant to kill them, to express their feelings with confidence, and to find their own voice.',
  email: 'precoiusowoko@gmail.com',
  phone: '+254 748458629',
  phoneHref: 'tel:+254748458629',
  whatsapp: 'https://wa.me/254748458629',
  location: 'Nakuru City, along Nakuru–Nyahururu highway, Kenya',
  shortLocation: 'Nakuru, Kenya',
  founded: '19 June 2021',
  founder: 'Precious Owoko',
  url: 'https://walkingshadowpoetry.com',
  social: {
    facebook: 'https://www.facebook.com/kenyanpoetess',
    instagram: 'https://www.instagram.com/walkingshadowpoetrykenya',
    youtube: 'https://youtube.com/@WalkingShadowPoetryKenya',
    tiktok: 'https://www.tiktok.com/@walkingshadowpoetry',
    whatsapp: 'https://wa.me/254748458629',
  },
} as const;

export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Our Story', path: '/about' },
  { label: 'Poetry', path: '/poetry' },
  { label: 'Episodes', path: '/episodes' },
  { label: 'Performances', path: '/performances' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Journal', path: '/journal' },
  { label: 'Contact', path: '/contact' },
] as const;

export const socialLinks = [
  { label: 'Instagram', href: site.social.instagram, handle: '@walkingshadowpoetrykenya' },
  { label: 'YouTube', href: site.social.youtube, handle: '@WalkingShadowPoetryKenya' },
  { label: 'Facebook', href: site.social.facebook, handle: 'kenyanpoetess' },
  { label: 'TikTok', href: site.social.tiktok, handle: '@walkingshadowpoetry' },
  { label: 'WhatsApp', href: site.social.whatsapp, handle: '+254 748 458 629' },
] as const;

export const values = [
  {
    title: 'Empathy',
    description:
      'A poetic journey that invites individuals to embrace their shadows, recognizing that within them lies the power to inspire and impact the world around them.',
  },
  {
    title: 'Integrity',
    description:
      'In a world often characterized by self-preservation and an individualistic mindset, Walking Shadow Poetry stands as a counter-narrative.',
  },
  {
    title: 'Humanity',
    description:
      'A spoken refuge that addresses lives, providing a pathway to healing, growth and positive change.',
  },
  {
    title: 'Creativity',
    description:
      'Acknowledges the collective need for something more, something beyond mere survival.',
  },
] as const;

export const mission = {
  mission:
    'Ensure positivity and growth in how people handle the various issues of life through art from the heart.',
  vision: 'Impact lives through poetry and art.',
  aim: 'Lending a voice to the voiceless.',
} as const;

export const aboutPrinciples = [
  {
    title: 'Empowering change',
    body: "We're not just poets; we help others find their strength. Walking Shadow Poetry encourages people to overcome their challenges, creating a positive effect that can inspire future generations.",
    image: '/media/gallery/artist-11.webp',
    imageAlt: 'A Walking Shadow Poetry portrait from the archive',
  },
  {
    title: 'A counter-narrative',
    body: 'In a world that often focuses on taking care of ourselves and being independent, we offer a different perspective. We understand that we need more than just to survive; we need to care for each other.',
    image: '/media/about/about-expression.webp',
    imageAlt: 'A Walking Shadow Poetry creative portrait',
  },
  {
    title: 'Solution-oriented',
    body: "We don't just point out flaws; we provide solutions. Walking Shadow Poetry is a spoken refuge, offering a pathway to healing, growth, and positive change.",
    image: '/media/gallery/artist-04.webp',
    imageAlt: 'A Walking Shadow Poetry performance portrait',
  },
] as const;

export const milestones = [
  {
    year: '2021',
    date: 'January 2021',
    title: 'Nakuru Players Theatre',
    description:
      'An early performance at Nakuru Players Theatre is documented in the Walking Shadow archive.',
  },
  {
    year: '2021',
    date: '19 June 2021',
    title: 'Walking Shadow Poetry begins',
    description:
      'The platform is founded in Nakuru, Kenya, with a simple conviction: words can help people grow from what is meant to kill them.',
  },
  {
    year: '2023',
    date: 'October – November 2023',
    title: 'Relationships, Emotions and Breaks',
    description:
      'Three performed pieces are published as reels, extending the work beyond the room and into a wider digital audience.',
  },
  {
    year: '2024',
    date: '2024',
    title: 'Tukuza Awards 2024',
    description:
      'The Walking Shadow story is documented at the Tukuza Awards, alongside a growing community of creative work.',
  },
  {
    year: '2024',
    date: '2024',
    title: 'FEMA Awards 2024',
    description:
      'Another chapter in the archive, captured at the FEMA Awards and shared in the gallery.',
  },
] as const;

export const bookingEventTypes = [
  'Poetry performance',
  'Spoken-word feature',
  'Festival or live event',
  'Creative collaboration',
  'Workshop or mentorship',
  'Other',
] as const;
