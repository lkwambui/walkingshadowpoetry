import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';
import { aboutPosts, categories, site } from '../data/content';

export default function About() {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Walking Shadow Poetry - our mission, values, and the story behind our name. We lend a voice to the voiceless through poetry and spoken word."
        canonical="https://walkingshadowpoetry.com/about"
      />

      {/* Page Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-gray-900), #1a1a2e)',
          padding: '80px 0 64px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
            opacity: 0.1,
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ color: 'var(--color-white)', marginBottom: 8 }}>About Us</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: '0.95rem' }}>
            <Link to="/" style={{ color: 'var(--color-gray-300)' }}>Home</Link>
            <span style={{ color: 'var(--color-gray-500)' }}>-</span>
            <span style={{ color: 'var(--color-primary)' }}>About Us</span>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: 48, alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {aboutPosts.map((post, i) => (
                  <article key={i}>
                    <div
                      style={{
                        borderRadius: 12,
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-md)',
                        background: 'var(--color-white)',
                      }}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        style={{ width: '100%', height: 280, objectFit: 'cover' }}
                        loading="lazy"
                      />
                      <div style={{ padding: 28 }}>
                        <h3 style={{ marginBottom: 12 }}>{post.title}</h3>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>{post.content}</p>
                        <a
                          href={site.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ marginTop: 16 }}
                        >
                          Read More on Facebook
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside style={{ position: 'sticky', top: 96 }}>
              {/* Categories */}
              <div
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 12,
                  padding: 28,
                  boxShadow: 'var(--shadow-md)',
                  marginBottom: 24,
                }}
              >
                <h3 style={{ marginBottom: 16, fontSize: '1.15rem', fontFamily: 'var(--font-body)' }}>
                  All Categories
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {categories.map((cat, i) => (
                    <li key={i}>
                      <a
                        href={site.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: 8,
                          color: 'var(--color-gray-600)',
                          fontSize: '0.9rem',
                          transition: 'background 150ms',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-gray-50)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span>{cat.name}</span>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{cat.count}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Latest Videos */}
              <div
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 12,
                  padding: 28,
                  boxShadow: 'var(--shadow-md)',
                  marginBottom: 24,
                }}
              >
                <h3 style={{ marginBottom: 16, fontSize: '1.15rem', fontFamily: 'var(--font-body)' }}>
                  Recent Videos on YouTube
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { title: 'The Pastor\'s Kid', url: 'https://www.youtube.com/watch?v=SQKmNTXhdvk&t=2s' },
                    { title: 'The Life Script', url: 'https://www.youtube.com/watch?v=f7FhOV2KBg4' },
                    { title: 'God Knows Why', url: 'https://youtube.com/watch?v=NFUMeq6xGuk' },
                    { title: 'One Word for the People', url: 'https://www.youtube.com/watch?v=kf3IqMA3xbI' },
                  ].map((v, i) => (
                    <li key={i}>
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 8,
                          textDecoration: 'none',
                          transition: 'background 150ms',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-gray-50)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span style={{ color: '#ff0000', flexShrink: 0, marginTop: 2 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                          </svg>
                        </span>
                        <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-gray-700)', marginBottom: 2 }}>
                            {v.title}
                          </p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>
                            Walking Shadow Poetry
                          </span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 12,
                  padding: 28,
                  boxShadow: 'var(--shadow-md)',
                  marginBottom: 24,
                }}
              >
                <h3 style={{ marginBottom: 16, fontSize: '1.15rem', fontFamily: 'var(--font-body)' }}>
                  Latest Tags
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    'spokenword', 'poetess', 'poetry', 'poet', 'walkingshadowpoetry',
                    'WalkingshadowpoetrybyPreciousOwoko', 'walkingshadowpoetrykenya',
                    'spokenwordartist', 'voiceoverartist', 'precoiusowoko',
                  ].map((tag, i) => (
                    <a
                      key={i}
                      href={`https://www.instagram.com/explore/tags/${tag}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        background: 'var(--color-gray-50)',
                        color: 'var(--color-gray-600)',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        transition: 'all 150ms',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--color-primary)';
                        e.currentTarget.style.color = 'var(--color-white)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'var(--color-gray-50)';
                        e.currentTarget.style.color = 'var(--color-gray-600)';
                      }}
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>

              {/* TikTok */}
              <div
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 12,
                  padding: 28,
                  boxShadow: 'var(--shadow-md)',
                  textAlign: 'center',
                }}
              >
                <h3 style={{ marginBottom: 12, fontSize: '1.15rem', fontFamily: 'var(--font-body)' }}>
                  Follow Us on TikTok
                </h3>
                <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer">
                  <img
                    src="/images/blog/tiktok.png"
                    alt="Walking Shadow Poetry TikTok"
                    style={{ width: '100%', maxWidth: 200, margin: '0 auto', borderRadius: 12 }}
                    loading="lazy"
                  />
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
