import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/format';
import Breadcrumbs from './Breadcrumbs';
import type { BreadcrumbItem } from './Breadcrumbs';
import ImageWithFallback from './ImageWithFallback';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image: string;
  imageAlt: string;
  breadcrumbs?: BreadcrumbItem[];
  size?: 'md' | 'lg';
  children?: ReactNode;
  className?: string;
}

export default function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  breadcrumbs,
  size = 'md',
  children,
  className,
}: PageHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        'relative isolate flex overflow-hidden bg-ink text-ivory',
        size === 'lg' ? 'min-h-[78vh]' : 'min-h-[60vh]',
        className,
      )}
    >
      <ImageWithFallback
        src={image}
        alt={imageAlt}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-ink/60" aria-hidden="true" />

      <div className="shell flex w-full flex-col justify-between pb-12 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} tone="dark" className="mb-16" />}

        <div className="max-w-6xl">
          <motion.p
            className="eyebrow mb-6 text-sand"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            className="max-w-5xl text-[clamp(3rem,8.5vw,8.5rem)] leading-[0.88] text-ivory"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h1>
          {intro && (
            <motion.div
              className="mt-7 max-w-xl text-sm leading-relaxed text-ivory/75 sm:text-base"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.35 }}
            >
              {intro}
            </motion.div>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
