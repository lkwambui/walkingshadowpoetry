import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Check } from '../components/ui/Icons';
import SEO from '../components/seo/SEO';
import { site } from '../data/content';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const message = data.get('message') as string;

    const mailto = `mailto:${site.email}?subject=Contact from ${name}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

    try {
      window.location.href = mailto;
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Walking Shadow Poetry. Based in Nakuru, Kenya. Reach out for poetry performances, spoken word events, and collaborations."
        canonical="https://walkingshadowpoetry.com/contact"
      />

      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-gray-900), #1a1a2e)',
          padding: '80px 0 64px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
            opacity: 0.1,
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'var(--color-white)', marginBottom: 8 }}>Our Contact Info</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: '0.95rem' }}>
            <Link to="/" style={{ color: 'var(--color-gray-300)' }}>Home</Link>
            <span style={{ color: 'var(--color-gray-500)' }}>-</span>
            <span style={{ color: 'var(--color-primary)' }}>Contact Us</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: 48, alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { icon: <MapPin size={22} color="var(--color-primary)" />, title: 'Our Location', lines: ['Nakuru City', 'Along Nakuru-Nyahururu highway'] },
                  { icon: <Phone size={22} color="var(--color-primary)" />, title: 'Phone Number', lines: [site.phone] },
                  { icon: <Mail size={22} color="var(--color-primary)" />, title: 'Email Address', lines: [site.email] },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: 20,
                      borderRadius: 12,
                      background: 'var(--color-white)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'var(--color-primary-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ marginBottom: 4, fontSize: '1rem' }}>{item.title}</h4>
                      {item.lines.map((line, j) => (
                        <p key={j} style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: 'var(--color-white)',
                borderRadius: 16,
                padding: 36,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <h3 style={{ marginBottom: 24, fontFamily: 'var(--font-body)' }}>Send us a message</h3>

              {status === 'success' ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '32px 16px',
                    background: 'var(--color-accent-light)',
                    borderRadius: 12,
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: 12, color: 'var(--color-accent)' }}><Check size={40} color="var(--color-accent)" /></div>
                  <h4 style={{ color: 'var(--color-accent-dark)', marginBottom: 8 }}>Message sent!</h4>
                  <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', margin: 0 }}>
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 20 }}
                    onClick={() => setStatus('idle')}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    disabled={status === 'submitting'}
                    style={inputStyle}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    disabled={status === 'submitting'}
                    style={inputStyle}
                  />
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Your Message"
                    required
                    disabled={status === 'submitting'}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === 'submitting'}
                    style={{ alignSelf: 'flex-start', opacity: status === 'submitting' ? 0.7 : 1 }}
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </button>
                  {status === 'error' && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0 }}>
                      Something went wrong. Please try emailing us directly at{' '}
                      <a href={`mailto:${site.email}`}>{site.email}</a>.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: 10,
  border: '1px solid var(--color-border)',
  fontSize: '0.95rem',
  fontFamily: 'var(--font-body)',
  color: 'var(--color-text)',
  background: 'var(--color-bg)',
  outline: 'none',
  transition: 'border-color 150ms',
};
