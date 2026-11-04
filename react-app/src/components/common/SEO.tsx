import { Helmet } from 'react-helmet-async';
import { site } from '../../data/site';
import { absoluteUrl } from '../../utils/format';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  noSuffix?: boolean;
  noindex?: boolean;
}

const organization = {
  '@type': 'Organization',
  '@id': `${site.url}/#organisation`,
  name: site.name,
  url: site.url,
  logo: absoluteUrl('/brand/logo-original.png', site.url),
  description: site.longDescription,
  email: site.email,
  telephone: site.phone,
  foundingDate: '2021-06-19',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nakuru',
    addressRegion: 'Nakuru County',
    addressCountry: 'KE',
    streetAddress: 'Nakuru–Nyahururu highway',
  },
  sameAs: [
    site.social.facebook,
    site.social.instagram,
    site.social.youtube,
    site.social.tiktok,
  ],
};

const website = {
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  name: site.name,
  url: site.url,
  publisher: { '@id': `${site.url}/#organisation` },
};

export default function SEO({
  title,
  description,
  path,
  image = '/og-image.jpg',
  type = 'website',
  jsonLd,
  noSuffix = false,
  noindex = false,
}: SEOProps) {
  const fullTitle = noSuffix ? title : `${title} | ${site.name}`;
  const canonical = `${site.url}${path === '/' ? '' : path}`;
  const imageUrl = absoluteUrl(image, site.url);
  const extra = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const graph = [organization, website, ...extra];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={`${site.name} — ${site.tagline}`} />
      <meta property="og:locale" content="en_KE" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
    </Helmet>
  );
}
