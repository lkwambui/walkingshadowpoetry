import {
  ArrowUp,
  ArrowUpRight,
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  Users,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { navLinks, site, socialLinks } from '../../data/site';
import Wordmark from './Wordmark';

const socialIcons = {
  Instagram: Camera,
  YouTube: Video,
  Facebook: Users,
  TikTok: Music2,
  WhatsApp: MessageCircle,
} as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-ivory">
      <div className="shell-wide border-b border-ivory/10 py-5">
        <div className="marquee-line" aria-hidden="true">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-10 pr-10 text-[0.6rem] uppercase tracking-[0.28em] text-ivory/35"
            >
              <span>Poetry</span>
              <span className="size-1 bg-brand" />
              <span>Spoken word</span>
              <span className="size-1 bg-brand" />
              <span>Storytelling</span>
              <span className="size-1 bg-brand" />
              <span>Resilience</span>
              <span className="size-1 bg-brand" />
              <span>Nakuru, Kenya</span>
              <span className="size-1 bg-brand" />
              <span>Art from the heart</span>
              <span className="size-1 bg-brand" />
            </div>
          ))}
        </div>
      </div>

      <div className="shell-wide pb-8 pt-14 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Wordmark tone="ivory" />
            <p className="mt-7 max-w-md font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] text-ivory">
              Grow from what&apos;s meant to <em className="text-sand">kill you.</em>
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/55">
              A platform where words take you on a journey and give resilience a voice. Poetry,
              spoken word and storytelling from Nakuru, Kenya.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-3 border-b border-brand-light pb-2 text-[0.64rem] uppercase tracking-[0.22em] text-ivory transition-colors hover:text-brand-light"
            >
              Start a conversation
              <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h2 className="eyebrow mb-6 text-ivory/40">Explore</h2>
            <ul className="space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-ivory/65 transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/shop"
                  className="text-sm text-ivory/65 transition-colors hover:text-ivory"
                >
                  Shop <span className="text-[0.55rem] uppercase tracking-[0.16em] text-ivory/35">Soon</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow mb-6 text-ivory/40">Visit</h2>
            <ul className="space-y-4 text-sm text-ivory/65">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-light" strokeWidth={1.5} />
                <span>{site.location}</span>
              </li>
              <li>
                <a href={site.phoneHref} className="flex gap-3 transition-colors hover:text-ivory">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand-light" strokeWidth={1.5} />
                  <span>{site.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex gap-3 break-all transition-colors hover:text-ivory"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand-light" strokeWidth={1.5} />
                  <span>{site.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={site.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 transition-colors hover:text-ivory"
                >
                  <MessageCircle
                    className="mt-0.5 size-4 shrink-0 text-brand-light"
                    strokeWidth={1.5}
                  />
                  <span>WhatsApp us</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow mb-6 text-ivory/40">Follow</h2>
            <ul className="space-y-3.5">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 text-sm text-ivory/65 transition-colors hover:text-ivory"
                    >
                      <Icon className="size-4 text-ivory/40 transition-colors group-hover:text-brand-light" strokeWidth={1.5} />
                      <span>{social.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-ivory/10 pt-6 text-[0.6rem] uppercase tracking-[0.18em] text-ivory/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Walking Shadow Poetry. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>Photography and words from the Walking Shadow archive</span>
            <a
              href={site.external.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-ivory"
            >
              Original journal
              <ArrowUpRight className="size-3" strokeWidth={1.5} />
            </a>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth',
                })
              }
              className="flex items-center gap-2 transition-colors hover:text-ivory"
            >
              Back to top
              <ArrowUp className="size-3" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
