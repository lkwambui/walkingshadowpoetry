import { Check, Link2, MessageCircle, Share2, Users } from 'lucide-react';
import { useState } from 'react';
import { shareLinks } from '../../utils/format';

interface ShareLinksProps {
  title: string;
  url?: string;
  tone?: 'light' | 'dark';
  className?: string;
}

export default function ShareLinks({ title, url, tone = 'light', className }: ShareLinksProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '');
  const links = shareLinks(shareUrl, title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const base =
    'flex size-9 items-center justify-center border transition-colors duration-200';

  return (
    <div className={className}>
      <p
        className={`mb-3 flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.2em] ${
          tone === 'dark' ? 'text-ivory/40' : 'text-ink/40'
        }`}
      >
        <Share2 className="size-3" strokeWidth={1.5} aria-hidden="true" />
        Share
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copy}
          className={`${base} ${
            tone === 'dark'
              ? 'border-ivory/20 text-ivory/70 hover:border-ivory hover:text-ivory'
              : 'border-ink/20 text-ink/60 hover:border-ink hover:text-ink'
          }`}
          aria-label={copied ? 'Link copied' : 'Copy link'}
        >
          {copied ? <Check className="size-3.5" strokeWidth={1.6} /> : <Link2 className="size-3.5" strokeWidth={1.6} />}
        </button>
        <a
          href={links.x}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} ${
            tone === 'dark'
              ? 'border-ivory/20 text-ivory/70 hover:border-ivory hover:text-ivory'
              : 'border-ink/20 text-ink/60 hover:border-ink hover:text-ink'
          }`}
          aria-label="Share on X"
        >
          <span className="text-xs font-medium">X</span>
        </a>
        <a
          href={links.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} ${
            tone === 'dark'
              ? 'border-ivory/20 text-ivory/70 hover:border-ivory hover:text-ivory'
              : 'border-ink/20 text-ink/60 hover:border-ink hover:text-ink'
          }`}
          aria-label="Share on Facebook"
        >
          <Users className="size-3.5" strokeWidth={1.6} />
        </a>
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} ${
            tone === 'dark'
              ? 'border-ivory/20 text-ivory/70 hover:border-ivory hover:text-ivory'
              : 'border-ink/20 text-ink/60 hover:border-ink hover:text-ink'
          }`}
          aria-label="Share on WhatsApp"
        >
          <MessageCircle className="size-3.5" strokeWidth={1.6} />
        </a>
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
}
