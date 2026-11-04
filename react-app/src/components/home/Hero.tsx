import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { site } from '../../data/site';
import Button from '../common/Button';
import ImageWithFallback from '../common/ImageWithFallback';

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 26 },
    animate: reduceMotion ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-ivory">
      <ImageWithFallback
        src="/media/hero/hero-performance.webp"
        alt="A Walking Shadow Poetry performance portrait"
        className="absolute inset-0 -z-20 hidden h-full w-full object-cover object-center sm:block"
        loading="eager"
        fetchPriority="high"
      />
      <ImageWithFallback
        src="/media/hero/hero-portrait.webp"
        alt="A Walking Shadow Poetry performance portrait"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center sm:hidden"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-ink/60" aria-hidden="true" />

      <div className="shell-wide relative flex min-h-[100svh] flex-col justify-between pb-8 pt-28 sm:pb-10 sm:pt-32">
        <motion.div
          className="flex items-start justify-between gap-6 text-[0.6rem] uppercase tracking-[0.22em] text-ivory/60"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="flex items-center gap-2">
            <MapPin className="size-3" strokeWidth={1.5} aria-hidden="true" />
            {site.shortLocation}
          </span>
          <span className="hidden text-right sm:block">
            Est. 2021 <span className="mx-2 text-brand-light">/</span> Art from the Heart
          </span>
        </motion.div>

        <div className="max-w-6xl pb-6 pt-20 sm:pb-10">
          <motion.p className="eyebrow mb-6 text-sand sm:mb-8" {...fadeUp(0.28)}>
            Poetry <span className="mx-2 text-ivory/35">·</span> Spoken word{' '}
            <span className="mx-2 text-ivory/35">·</span> Storytelling
          </motion.p>

          <motion.h1
            className="max-w-5xl text-[clamp(3.1rem,9.8vw,9.5rem)] leading-[0.86] text-ivory"
            {...fadeUp(0.36)}
          >
            Grow from what&apos;s meant to <em className="text-sand">kill you.</em>
          </motion.h1>

          <motion.p
            className="mt-8 max-w-xl text-sm leading-relaxed text-ivory/72 sm:mt-10 sm:text-base"
            {...fadeUp(0.46)}
          >
            Poetry, spoken word and storytelling that give voice to lived experiences, inspire
            resilience and connect people through the power of words.
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap items-center gap-4" {...fadeUp(0.56)}>
            <Button to="/poetry" variant="primary">
              Explore our poetry
            </Button>
            <Button to="/about" variant="outline-light">
              Discover our story
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col gap-5 border-t border-ivory/20 pt-5 text-[0.6rem] uppercase tracking-[0.2em] text-ivory/55 sm:flex-row sm:items-center sm:justify-between"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
        >
          <span className="flex items-center gap-3">
            <span className="size-1.5 shrink-0 bg-brand" aria-hidden="true" />
            A platform for the words that need to be heard.
          </span>
          <div className="flex items-center gap-6">
            <Link
              to="/episodes"
              className="group flex items-center gap-2 transition-colors hover:text-ivory"
            >
              Watch an episode
              <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
            </Link>
            <a
              href="#introduction"
              className="group flex items-center gap-2 transition-colors hover:text-ivory"
            >
              Scroll
              <ArrowDown className="size-3 transition-transform group-hover:translate-y-0.5" strokeWidth={1.5} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
