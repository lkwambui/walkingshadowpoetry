import DOMPurify from 'dompurify';

const allowedEmbedHosts = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
  'w.soundcloud.com',
  'open.spotify.com',
]);

DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  if (node.nodeName.toLowerCase() !== 'iframe' || data.attrName !== 'src') return;

  try {
    const url = new URL(data.attrValue, window.location.origin);
    if (url.protocol !== 'https:' || !allowedEmbedHosts.has(url.hostname)) {
      data.keepAttr = false;
    }
  } catch {
    data.keepAttr = false;
  }
});

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.nodeName.toLowerCase() !== 'iframe') return;
  if (!node.hasAttribute('loading')) node.setAttribute('loading', 'lazy');
  if (!node.hasAttribute('referrerpolicy')) {
    node.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  }
});

const sanitizeOptions = {
  ADD_TAGS: ['iframe', 'audio', 'video', 'source'],
  ADD_ATTR: [
    'allow',
    'allowfullscreen',
    'frameborder',
    'loading',
    'referrerpolicy',
    'playsinline',
    'controls',
    'width',
    'height',
  ],
};

interface WordPressContentProps {
  html: string;
}

export default function WordPressContent({ html }: WordPressContentProps) {
  const cleanHtml = DOMPurify.sanitize(html, sanitizeOptions);

  return (
    <div
      className="wordpress-content prose-editorial"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
