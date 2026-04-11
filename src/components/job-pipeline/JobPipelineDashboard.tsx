'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Filter, Home, MoonStar, Sun } from 'lucide-react';
import JobCard from './JobCard';
import { jobItems } from './jobData';

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-violet-400/30 bg-white/20 p-5 backdrop-blur-xl">
      <div className="animate-pulse space-y-4">
        <div className="h-12 w-12 rounded-full bg-white/40" />
        <div className="h-4 w-2/3 rounded bg-white/40" />
        <div className="h-7 w-5/6 rounded bg-white/35" />
        <div className="h-20 rounded-2xl bg-white/30" />
        <div className="h-10 rounded-xl bg-white/45" />
      </div>
    </div>
  );
}

type Shape = {
  id: number;
  className: string;
  duration: number;
  delay: number;
};

const floatingShapes: Shape[] = [
  { id: 1, className: 'left-[4%] top-[16%] h-20 w-20 rounded-full bg-white/20', duration: 12, delay: 0.1 },
  {
    id: 2,
    className:
      'left-[16%] top-[52%] h-20 w-20 bg-violet-200/30 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0%_50%)]',
    duration: 14,
    delay: 0.5,
  },
  { id: 3, className: 'right-[9%] top-[18%] h-28 w-28 rounded-full bg-pink-200/25', duration: 11, delay: 0.2 },
  {
    id: 4,
    className:
      'right-[18%] top-[65%] h-24 w-24 bg-sky-200/25 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0%_50%)]',
    duration: 16,
    delay: 0.8,
  },
];

export default function JobPipelineDashboard() {
  const [theme, setTheme] = useState<'sunset' | 'ocean'>('sunset');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const allItems = useMemo(() => {
    return Array.from({ length: 3 }).flatMap((_, idx) =>
      jobItems.map((item) => ({ ...item, id: item.id + idx * 100 }))
    );
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('pipeline-theme');
    const nextTheme = storedTheme === 'ocean' ? 'ocean' : 'sunset';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    setMounted(true);

    const timer = window.setTimeout(() => setLoading(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('pipeline-theme', theme);
  }, [mounted, theme]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) {
          return;
        }
        setVisibleCount((prev) => Math.min(prev + 4, allItems.length));
      },
      { threshold: 0.3 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [allItems.length]);

  const visibleItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[image:var(--sunset-bg)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.28),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.2),transparent_40%)]" />

      <div className="pointer-events-none absolute inset-0">
        {floatingShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className={`absolute blur-[1px] ${shape.className}`}
            animate={{ y: [0, -24, 0], x: [0, 8, 0], rotate: [0, 6, 0] }}
            transition={{ duration: shape.duration, repeat: Infinity, ease: 'easeInOut', delay: shape.delay }}
          />
        ))}
      </div>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav className="mx-auto mt-4 flex w-[min(1220px,94%)] items-center justify-between rounded-2xl border border-violet-500/30 bg-white/15 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--primary)] text-sm font-black">PM</div>
            <span className="text-sm font-semibold tracking-[0.2em]">PIPELINE</span>
          </div>

          <div className="hidden items-center gap-5 text-sm font-medium md:flex">
            <a href="/" className="inline-flex items-center gap-1.5 text-white/90 transition hover:text-white">
              <Home size={15} /> Home
            </a>
            <a href="#pipeline-grid" className="text-white/90 transition hover:text-white">
              Pipeline
            </a>
            <button type="button" className="inline-flex items-center gap-1.5 text-white/90 transition hover:text-white">
              <Filter size={14} /> Filter
            </button>
          </div>

          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === 'sunset' ? 'ocean' : 'sunset'))}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1.5 text-xs font-semibold"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={theme}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1.5"
              >
                {theme === 'sunset' ? <MoonStar size={14} /> : <Sun size={14} />}
                {theme === 'sunset' ? 'Ocean Mode' : 'Sunset Mode'}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      <main className="relative z-10 px-4 pb-16 pt-28 md:px-8 md:pt-32">
        <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-[min(1220px,100%)] flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-5">
            <h1 className="bg-[image:var(--sunset-text)] bg-clip-text text-5xl font-black leading-tight text-transparent md:text-7xl">
              Pipeline Mastery
            </h1>
            <p className="max-w-2xl text-base text-white/90 md:text-xl">Track every stage with elegance</p>
          </motion.div>

          <motion.a
            href="#pipeline-grid"
            aria-label="Scroll to pipeline cards"
            className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-xl"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            Explore Pipeline <ChevronDown size={16} />
          </motion.a>
        </section>

        <section id="pipeline-grid" className="mx-auto w-[min(1220px,100%)] pt-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {visibleItems.map((item, index) => (
                  <JobCard key={item.id} item={item} index={index} />
                ))}
              </div>
              <div ref={sentinelRef} className="h-12 w-full" aria-hidden />
              {hasMore ? <p className="mt-2 text-center text-sm text-white/85">Loading more opportunities...</p> : null}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
