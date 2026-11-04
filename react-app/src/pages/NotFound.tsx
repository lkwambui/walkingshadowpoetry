import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import PageTransition from '../components/common/PageTransition';
import SEO from '../components/common/SEO';

const links = [
  { to: '/poetry', label: 'Poetry' },
  { to: '/journal', label: 'Journal' },
  { to: '/episodes', label: 'Episodes' },
  { to: '/gallery', label: 'Gallery' },
];

export default function NotFound() {
  return (
    <PageTransition>
      <SEO
        title="Page not found"
        description="The page you are looking for could not be found. Return to Walking Shadow Poetry."
        path="/404"
        noindex
      />

      <section className="flex min-h-screen items-center bg-ink pb-20 pt-32 text-ivory">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow text-sand">404</p>
              <h1 className="mt-4 text-[clamp(3.4rem,10vw,9rem)] leading-[0.85] text-ivory">
                This page has <em className="text-sand">walked on.</em>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/60">
                The page you are looking for is not here. It may have moved, or the link may be
                incomplete. The words are still where they should be.
              </p>
              <Link
                to="/"
                className="mt-9 inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-[0.62rem] uppercase tracking-[0.2em] text-ivory/80 transition-colors hover:border-ivory hover:text-ivory"
              >
                <ArrowLeft className="size-3.5" strokeWidth={1.5} />
                Back home
              </Link>
            </div>

            <div className="lg:col-span-3 lg:col-start-10">
              <p className="text-[0.55rem] uppercase tracking-[0.2em] text-ivory/35">
                Or continue reading
              </p>
              <div className="mt-5 flex flex-col border-t border-ivory/15">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center justify-between border-b border-ivory/15 py-4 text-sm text-ivory/65 transition-colors hover:text-ivory"
                  >
                    {link.label}
                    <ArrowUpRight
                      className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.5}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
