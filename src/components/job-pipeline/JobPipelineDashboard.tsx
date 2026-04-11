'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Filter, Home, MoonStar, Sun } from 'lucide-react';
import JobCard from './JobCard';
import { jobItems } from './jobData';
import SavedRoleNotifier from '@/components/SavedRoleNotifier';

function SkeletonCard() {
  return (
    <div className="premium-card p-5">
      <div className="animate-pulse space-y-4">
        <div className="h-12 w-12 rounded-full bg-stone-100" />
        <div className="h-4 w-2/3 rounded bg-stone-100" />
        <div className="h-7 w-5/6 rounded bg-stone-100" />
        <div className="h-20 rounded-2xl bg-stone-100" />
        <div className="h-10 rounded-xl bg-stone-100" />
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
  { id: 1, className: 'left-[4%] top-[16%] h-20 w-20 rounded-full bg-stone-300/35', duration: 12, delay: 0.1 },
  {
    id: 2,
    className:
      'left-[16%] top-[52%] h-20 w-20 bg-stone-300/35 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0%_50%)]',
    duration: 14,
    delay: 0.5,
  },
  { id: 3, className: 'right-[9%] top-[18%] h-28 w-28 rounded-full bg-neutral-200/40', duration: 11, delay: 0.2 },
  {
    id: 4,
    className:
      'right-[18%] top-[65%] h-24 w-24 bg-zinc-300/35 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0%_50%)]',
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
    <div className="mesh-background relative min-h-screen overflow-hidden text-[var(--foreground)]">
      <div className="paper-grain" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.5),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.28),transparent_40%)]" />

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
        className="fixed inset-x-0 top-0 z-40"
      >
        <nav className="premium-card mx-auto mt-4 flex w-[min(1220px,94%)] items-center justify-between bg-white/85 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-black/5 bg-[#F5F5F0] text-sm font-black text-[#1C1917]">PM</div>
            <span className="text-sm font-semibold tracking-[0.2em] text-[#1C1917]">PIPELINE</span>
          </div>

          <div className="hidden items-center gap-5 text-sm font-medium md:flex">
            <a href="/" className="inline-flex items-center gap-1.5 text-[#1C1917] transition hover:text-black">
              <Home size={15} /> Home
            </a>
            <a href="#pipeline-grid" className="text-[#1C1917] transition hover:text-black">
              Pipeline
            </a>
            <button type="button" className="subtle-control inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm">
              <Filter size={14} /> Filter
            </button>
          </div>

          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === 'sunset' ? 'ocean' : 'sunset'))}
            className="subtle-control inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
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
            <h1 className="bg-[linear-gradient(135deg,#1C1917,#57534E)] bg-clip-text text-5xl font-black leading-tight text-transparent md:text-7xl">
              Pipeline Mastery
            </h1>
            <p className="max-w-2xl text-base text-[#78716C] md:text-xl">Track every stage with elegance</p>
          </motion.div>

          <motion.a
            href="#pipeline-grid"
            aria-label="Scroll to pipeline cards"
            className="subtle-control mt-10 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
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
              {hasMore ? <p className="mt-2 text-center text-sm text-[#78716C]">Loading more opportunities...</p> : null}
            </>
          )}
        </section>
      </main>
      <SavedRoleNotifier />
    </div>
  );
}
