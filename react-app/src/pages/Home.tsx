import PageTransition from '../components/common/PageTransition';
import SEO from '../components/common/SEO';
import BookingCTA from '../components/home/BookingCTA';
import BrandIntroduction from '../components/home/BrandIntroduction';
import FeaturedEpisodes from '../components/home/FeaturedEpisodes';
import FeaturedPoetry from '../components/home/FeaturedPoetry';
import GalleryPreview from '../components/home/GalleryPreview';
import Hero from '../components/home/Hero';
import JournalPreview from '../components/home/JournalPreview';
import PerformancesPreview from '../components/home/PerformancesPreview';
import { site } from '../data/site';

export default function Home() {
  return (
    <PageTransition>
      <SEO
        title="Walking Shadow Poetry — Art from the Heart"
        description={site.longDescription}
        path="/"
        image="/media/hero/hero-performance.webp"
        noSuffix
      />
      <Hero />
      <BrandIntroduction />
      <FeaturedPoetry />
      <FeaturedEpisodes />
      <PerformancesPreview />
      <GalleryPreview />
      <JournalPreview />
      <BookingCTA />
    </PageTransition>
  );
}
