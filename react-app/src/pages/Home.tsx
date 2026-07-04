import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import { MapPin, Heart, Handshake, Globe, Sparkle } from '../components/ui/Icons';
import { site, coreValues, masterpieces, galleryItems, events } from '../data/content';

export default function Home() {
  return (
    <>
      <SEO
        description="Walking Shadow Poetry - A platform where words take you on a journey and give resilience a voice. Grow from what's meant to kill you."
        canonical="https://walkingshadowpoetry.com"
      />

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(12,10,9,0.85) 0%, rgba(26,26,46,0.88) 50%, rgba(28,25,23,0.85) 100%), url(/images/banner/banner_01.jpg) center / cover no-repeat',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-40%',
            right: '-20%',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)',
            opacity: 0.08,
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 640 }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                color: 'var(--color-white)',
                lineHeight: 1.15,
                marginBottom: 20,
              }}
            >
              {site.name}
            </h1>
            <p
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                color: 'var(--color-primary-light)',
                fontStyle: 'italic',
                fontFamily: 'var(--font-heading)',
                marginBottom: 8,
              }}
            >
              "{site.slogan}"
            </p>
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--color-gray-300)',
                marginBottom: 32,
                lineHeight: 1.8,
                maxWidth: 540,
              }}
            >
              We remind you of your ability to grow from what's meant to kill you, acquire confidence to express your
              feelings, and find your own voice through poetry and spoken word.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn-primary btn-lg">
                Read More
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
                Have an enquiry?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 64 }}>
            <div>
              <img
                src="/images/about/about.png"
                alt="About Walking Shadow Poetry"
                style={{ width: '100%', borderRadius: 16, boxShadow: 'var(--shadow-xl)' }}
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="section-title" style={{ marginBottom: 16 }}>
                About Us
              </h2>
              <p>
                Walking Shadow Poetry is a platform where words take you on a journey and give resilience a voice. We
                started on June 19, 2021, and we are more than just poetry. Our work shows the strength of the human
                spirit and its ability to rise above challenges.
              </p>
              <p>
                Our name, Walking Shadow, comes from the biblical story of Peter, a disciple of Jesus. In the story,
                Peter's shadow carried healing power and brought change wherever it fell. This inspires us because it
                shows the hope and potential each of us has to make a difference.
              </p>
              <h4 style={{ marginTop: 24, marginBottom: 8, fontFamily: 'var(--font-body)' }}>
                Transformative Essence
              </h4>
              <p>
                Like Peter's shadow, Walking Shadow Poetry represents the power to bring change. We believe that even in
                the darkest moments, there is always room for growth and renewal.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                <Link to="/about" className="btn btn-primary btn-sm">
                  Read More
                </Link>
                <Link to="/contact" className="btn btn-outline btn-sm">
                  Have an enquiry?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader title="Our Core Values" subtitle="Lending a voice to the voiceless." />
          <div className="grid-4">
            {coreValues.map((v, i) => (
              <Card key={i} className="core-value-card">
                <div style={{ padding: 32, textAlign: 'center' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: 'var(--color-primary-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '1.5rem',
                    }}
                  >
                    {[<Heart key="h" size={24} />, <Handshake key="hs" size={24} />, <Globe key="g" size={24} />, <Sparkle key="s" size={24} />][i]}
                  </div>
                  <h4 style={{ marginBottom: 8 }}>{v.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', margin: 0 }}>
                    {v.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Masterpieces */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="The Masterpieces"
            subtitle="Be able to impact lives and touch hearts in this generation through poetry and art."
          />
          <div className="grid-3">
            {masterpieces.map((item, i) => (
              <Card key={i}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: 240, objectFit: 'cover' }}
                    loading="lazy"
                  />
                </a>
                <div style={{ padding: 24 }}>
                  <h4>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {item.title}
                    </a>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-400)', marginBottom: 8 }}>
                    Performed on: {item.date}
                  </p>
                  <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>{item.excerpt}</p>
                </div>
                <div
                  style={{
                    padding: '12px 24px',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.85rem',
                    color: 'var(--color-gray-500)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                  </svg>
                  walkingshadowpoetrykenya
                </div>
              </Card>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              See More on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader title="Gallery" subtitle="Art from the Heart." />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 12,
            }}
          >
            {galleryItems.slice(0, 6).map((item, i) => (
              <a
                key={i}
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'relative',
                  borderRadius: 12,
                  overflow: 'hidden',
                  display: 'block',
                  aspectRatio: item.category === 'artist' ? '3/4' : '4/3',
                }}
              >
                <img
                  src={item.src}
                  alt={item.title || 'Gallery image'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 300ms' }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                    opacity: 0,
                    transition: 'opacity 200ms',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 16,
                  }}
                  className="gallery-overlay"
                >
                  <div>
                    <h4 style={{ color: 'var(--color-white)', margin: 0, fontSize: '1rem' }}>{item.title}</h4>
                    {item.caption && (
                      <p style={{ color: 'var(--color-gray-200)', fontSize: '0.8rem', margin: 0 }}>{item.caption}</p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/gallery" className="btn btn-primary">
              View More Gallery
            </Link>
          </div>
        </div>
        <style>{`
          .gallery-overlay { opacity: 0; }
          a:hover .gallery-overlay { opacity: 1; }
          a:hover img { transform: scale(1.05); }
        `}</style>
      </section>

      {/* Events */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Event Performances"
            subtitle="Ensure Positivity and growth in how people handle various issues of life through art from the heart."
          />
          <div className="grid-3">
            {events.map((event, i) => (
              <Card key={i}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={event.image}
                    alt={event.title}
                    style={{ width: '100%', height: 240, objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'var(--color-primary)',
                      color: 'var(--color-white)',
                      padding: '6px 14px',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                    }}
                  >
                    {event.date}
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <h4>{event.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-400)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} color="var(--color-gray-400)" />
                    {event.location}
                  </p>
                  <p style={{ fontSize: '0.9rem' }}>{event.excerpt}</p>
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: 12 }}
                  >
                    Watch on YouTube
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
