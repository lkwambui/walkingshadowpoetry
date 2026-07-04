export const site = {
  name: 'Walking Shadow Poetry',
  tagline: 'Art from the Heart',
  slogan: 'Grow from what\'s meant to kill you',
  description: 'A platform where words take you on a journey and give resilience a voice.',
  email: 'precoiusowoko@gmail.com',
  phone: '+254 748458629',
  location: 'Nakuru City, Along Nakuru-Nyahururu highway, Kenya',
  founded: 'June 19, 2021',
  founder: 'Precious Owoko',
  social: {
    facebook: 'https://www.facebook.com/kenyanpoetess',
    instagram: 'https://www.instagram.com/walkingshadowpoetrykenya',
    youtube: 'https://youtube.com/@WalkingShadowPoetryKenya',
    whatsapp: 'https://wa.me/0748458629',
    tiktok: 'https://www.tiktok.com/@walkingshadowpoetry',
  },
  external: {
    blog: 'https://walkingshadowpoetry.com/blog/',
    shop: 'https://walkingshadowpoetry.com/shop/',
  },
};

export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Episodes', path: '/episodes' },
  { label: 'Shop', path: site.external.shop, external: true },
];

export const coreValues = [
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
];

export const masterpieces = [
  {
    title: 'Relationships',
    image: '/images/classes/class_01.jpg',
    date: '5 November, 2023',
    excerpt: 'Appreciate the possibility of new relationships as you naturally...',
    link: 'https://www.instagram.com/reel/CzQvh7-sr_r/',
  },
  {
    title: 'Emotions',
    image: '/images/classes/class_02.jpg',
    date: '19 October, 2023',
    excerpt: 'I had to kill emotions to survive. I had to kill bad habits to survive...',
    link: 'https://www.instagram.com/reel/CylsgfdMdG7/',
  },
  {
    title: 'Breaks',
    image: '/images/classes/class_03.jpg',
    date: '2 November, 2023',
    excerpt: 'Short breaks are really necessary and important in this life...',
    link: 'https://www.instagram.com/reel/CzIcaKrtEfl/',
  },
];

export const events = [
  {
    title: 'You are a Hero',
    image: '/images/event/event_01.jpg',
    date: '20 October',
    location: 'Nakuru',
    excerpt:
      'Some of us grew up thinking, that our heroes are our dads and moms...',
    link: 'https://www.youtube.com/watch?v=axwF00RH97c',
  },
  {
    title: 'Walk Alone',
    image: '/images/event/event_02.jpg',
    date: '12 January',
    location: 'Nakuru',
    excerpt:
      'I walked alone in this path, had no one to call my own, life was tough and smile...',
    link: 'https://www.youtube.com/watch?v=8UaPo7daicg',
  },
  {
    title: 'Expect Anything from Anyone',
    image: '/images/event/event_03.jpg',
    date: '31 October',
    location: 'Nakuru',
    excerpt:
      'The person you trust most can betray you, the people you love most can hate you...',
    link: 'https://www.youtube.com/watch?v=m9upy32Yo2Y',
  },
];

export interface GalleryItem {
  src: string;
  category: 'awards' | 'campaigns' | 'collections' | 'artist';
  title?: string;
  caption?: string;
}

export const galleryItems: GalleryItem[] = [
  { src: '/images/gallery/gallery_18.jpg', category: 'awards', title: 'Tukuza Awards 2024', caption: 'Tukuza awards 2024' },
  { src: '/images/gallery/fema_awards1.jpg', category: 'awards', title: 'FEMA Awards 2024', caption: 'FEMA awards 2024' },
  { src: '/images/gallery/fema_awards2.jpg', category: 'awards', title: 'FEMA Awards 2024', caption: 'FEMA awards 2024' },
  { src: '/images/gallery/gallery_17.jpg', category: 'campaigns', title: 'Campaign', caption: 'Campaign to end gender based violence' },
  { src: '/images/gallery/gallery_03.jpg', category: 'collections', title: 'Motto', caption: 'Art from the Heart' },
  { src: '/images/gallery/gallery_04.jpg', category: 'collections', title: 'Vision', caption: 'Impact lives through poetry and art' },
  { src: '/images/gallery/gallery_05.jpg', category: 'collections', title: 'Core Values', caption: 'Empathy, Integrity, Humanity, Creativity' },
  { src: '/images/gallery/gallery_06.jpg', category: 'collections', title: 'Mission', caption: 'Ensure Positivity and growth through art from the heart.' },
  { src: '/images/gallery/gallery_10.jpg', category: 'collections', title: 'Our Slogan', caption: 'Grow from what\'s meant to kill you.' },
  { src: '/images/gallery/gallery_11.jpg', category: 'collections', title: 'Aim', caption: 'Lending a voice to the voiceless.' },
  { src: '/images/gallery/gallery_12.jpg', category: 'collections', title: 'Mission', caption: 'Ensure Positivity and growth through art.' },
  { src: '/images/gallery/gallery_20.JPG', category: 'artist', title: 'Artist', caption: '' },
  { src: '/images/gallery/gallery_22.JPG', category: 'artist', title: 'Artist', caption: '' },
  { src: '/images/gallery/gallery_24.JPG', category: 'artist', title: 'Artist', caption: '' },
  { src: '/images/gallery/gallery_28.JPG', category: 'artist', title: 'Artist', caption: '' },
  { src: '/images/gallery/gallery_29.JPG', category: 'artist', title: 'Artist', caption: '' },
  { src: '/images/gallery/gallery_31.JPG', category: 'artist', title: 'Artist', caption: '' },
  { src: '/images/gallery/gallery_30.JPG', category: 'artist', title: 'Artist', caption: '' },
  { src: '/images/gallery/gallery_25.JPG', category: 'artist', title: 'Artist', caption: '' },
  { src: '/images/gallery/gallery_21.JPG', category: 'artist', title: 'Artist', caption: '' },
];

export const aboutPosts = [
  {
    title: 'Empowering Change',
    image: '/images/blog/post_01.jpg',
    content:
      "We're not just poets; we help others find their strength. Walking Shadow Poetry encourages people to overcome their challenges, creating a positive effect that can inspire future generations.",
  },
  {
    title: 'Counter-Narrative',
    image: '/images/blog/post_02.jpg',
    content:
      'In a world that often focuses on taking care of ourselves and being independent, we offer a different perspective. We understand that we need more than just to survive; we need to care for each other.',
  },
  {
    title: 'Solution-oriented',
    image: '/images/blog/post_03.jpg',
    content:
      "We don't just point out flaws; we provide solutions. Walking Shadow Poetry is a spoken refuge, offering a pathway to healing, growth, and positive change.",
  },
  {
    title: 'Join Us on This Poetic Journey',
    image: '/images/blog/post_04.jpg',
    content:
      'Join us on this poetic journey. Embrace your shadows, for within them lies the power to inspire and impact the world.',
  },
];

export const categories = [
  { name: 'Spoken Word', count: 5 },
  { name: 'Poetry', count: 27 },
  { name: 'Reels', count: 7 },
  { name: 'Videos', count: 9 },
  { name: 'Quotes', count: 8 },
  { name: 'Posts', count: 25 },
];

export const footerPosts = [
  { image: '/images/blog/footer_post_01.jpg', text: 'All time..Everytime...Always.', date: '25 April, 2023', link: 'https://web.facebook.com/photo.php?fbid=239541511947698' },
  { image: '/images/blog/footer_post_02.jpg', text: 'Performance at Nakuru Players Theatre', date: '28 January, 2021', link: 'https://web.facebook.com/photo.php?fbid=201353765766473' },
  { image: '/images/blog/footer_post_03.jpg', text: 'Life life life.', date: '01 September, 2021', link: 'https://web.facebook.com/photo.php?fbid=309506148284567' },
];

export const facebookWidget = [
  { text: 'Why did you go too soon.', date: '17th November, 2023' },
  { text: 'Light of a Candle.', date: '13th June, 2023' },
  { text: 'Dear Best Friend', date: '30th July, 2023' },
];

export const sidebarGallery = Array.from({ length: 6 }, (_, i) => `/images/sidebar/gallery_0${i + 1}.jpg`);
