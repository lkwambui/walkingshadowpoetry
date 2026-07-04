import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

export default function SEO({
  title,
  description = 'A platform where words take you on a journey and give resilience a voice. Walking Shadow Poetry is a spoken word and poetry platform based in Nakuru, Kenya.',
  canonical,
  ogImage = '/images/logo.png',
  ogType = 'website',
}: SEOProps) {
  const siteName = 'Walking Shadow Poetry';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Art from the Heart`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical || 'https://walkingshadowpoetry.com'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
