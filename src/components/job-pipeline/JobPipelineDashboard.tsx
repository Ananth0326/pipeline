'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, SunMedium } from 'lucide-react';
import JobCard from './JobCard';
import { jobItems } from './jobData';

type Particle = {
  id: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
  size: number;
};

const particles: Particle[] = [
  { id: 1, left: '8%', top: '18%', duration: 16, delay: 0, size: 6 },
  { id: 2, left: '22%', top: '70%', duration: 19, delay: 1, size: 5 },
  { id: 3, left: '37%', top: '40%', duration: 14, delay: 2, size: 8 },
  { id: 4, left: '54%', top: '22%', duration: 21, delay: 0.8, size: 7 },
  { id: 5, left: '69%', top: '64%', duration: 18, delay: 1.4, size: 6 },
  { id: 6, left: '83%', top: '33%', duration: 13, delay: 0.6, size: 5 },
  { id: 7, left: '12%', top: '84%', duration: 20, delay: 1.9, size: 7 },
  { id: 8, left: '46%', top: '80%', duration: 17, delay: 2.1, size: 5 },
  { id: 9, left: '75%', top: '9%', duration: 15, delay: 2.5, size: 7 },
  { id: 10, left: '92%', top: '52%', duration: 22, delay: 1.2, size: 4 },
  { id: 11, left: '3%', top: '49%', duration: 12, delay: 0.3, size: 5 },
  { id: 12, left: '60%', top: '91%', duration: 23, delay: 2.8, size: 6 },
];

export default function JobPipelineDashboard() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('pipeline-theme');
    const nextTheme = storedTheme === 'light' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('pipeline-theme', theme);
  }, [mounted, theme]);

  const heroStats = useMemo(
    () => [
      { label: 'Active Pipelines', value: '08' },
      { label: 'Interviews This Week', value: '05' },
      { label: 'Offer Conversion', value: '74%' },
    ],
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--cosmic-bg)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(102,126,234,0.18),transparent_45%),radial-gradient(circle_at_75%_0%,rgba(118,75,162,0.22),transparent_42%)]" />

      <div className="pointer-events-none absolute inset-0">
        <motion.div
          aria-hidden
          animate={{ y: [0, -16, 0], x: [0, 24, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl"
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, 20, 0], x: [0, -14, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-0 top-24 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl"
        />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            animate={{ y: [0, -24, 0], opacity: [0.1, 0.7, 0.1] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <header className="fixed inset-x-0 top-0 z-50">
        <nav className="mx-auto mt-4 flex w-[min(1200px,92%)] items-center justify-between rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-5 py-3 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--primary)] text-sm font-black">JP</div>
            <p className="text-sm font-semibold tracking-[0.18em] text-white/90">PIPELINE</p>
          </div>

          <button
            type="button"
            aria-label="Toggle color mode"
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1"
              >
                {mounted && theme === 'dark' ? <Moon size={14} /> : <SunMedium size={14} />}
                {mounted && theme === 'dark' ? 'Dark' : 'Light'}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-[min(1200px,92%)] pb-16 pt-32 md:pt-36">
        <section className="rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-7 backdrop-blur-xl md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-center">
            <div className="space-y-5">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="text-balance text-4xl font-black leading-tight sm:text-5xl md:text-6xl"
              >
                <span className="hero-glow-text">Job Pipeline Mastery</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                className="max-w-xl text-sm text-white/75 sm:text-base"
              >
                Organize every application, focus your next move, and keep momentum through interviews, offers, and
                follow-ups.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1"
            >
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="mt-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
            {jobItems.map((item, index) => (
              <JobCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
