import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import ProgressRing from './ProgressRing';
import { JobPipelineItem } from './types';

type JobCardProps = {
  item: JobPipelineItem;
  index: number;
};

export default function JobCard({ item, index }: JobCardProps) {
  const initials = item.company
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 backdrop-blur-2xl shadow-[0_10px_36px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(102,126,234,0.25),0_0_50px_rgba(118,75,162,0.3)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_42%)]" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/20 bg-white/10 text-sm font-bold text-white">
            {initials}
          </div>
          <StatusBadge status={item.status} />
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">{item.company}</p>
          <h3 className="bg-[var(--primary)] bg-clip-text text-lg font-bold text-transparent">{item.jobTitle}</h3>
        </div>

        <div className="flex items-center justify-between gap-4">
          <ProgressRing progress={item.progress} gradientId={`job-gradient-${index}`} />
          <div className="min-w-0 space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Next action</p>
            <p className="text-sm leading-snug text-white/90">{item.nextAction}</p>
          </div>
        </div>

        <button
          type="button"
          className="group/button relative isolate w-full overflow-hidden rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.01]"
        >
          <span className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/button:opacity-100 bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,transparent_60%)]" />
          <span className="absolute left-1/2 top-1/2 -z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 opacity-0 blur-md transition-all duration-500 group-hover/button:h-40 group-hover/button:w-40 group-hover/button:opacity-30" />
          Next Step
        </button>
      </div>
    </motion.article>
  );
}
