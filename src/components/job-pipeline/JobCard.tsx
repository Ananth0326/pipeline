import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import ProgressRing from './ProgressRing';
import { JobPipelineItem, JobStatus } from './types';

type JobCardProps = {
  item: JobPipelineItem;
  index: number;
};

export default function JobCard({ item, index }: JobCardProps) {
  const stageProgress: Record<JobStatus, number> = {
    Applied: 20,
    Interview: 60,
    Offer: 90,
    Rejected: 35,
  };
  const stageGlow: Record<JobStatus, string> = {
    Applied: 'hover:shadow-[0_18px_45px_rgba(245,158,11,0.36)]',
    Interview: 'hover:shadow-[0_18px_45px_rgba(59,130,246,0.35)]',
    Offer: 'hover:shadow-[0_18px_45px_rgba(16,185,129,0.35)]',
    Rejected: 'hover:shadow-[0_18px_45px_rgba(239,68,68,0.3)]',
  };
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
      whileHover={{ y: -4, scale: 1.05 }}
      className={`group relative overflow-hidden rounded-3xl border border-violet-500/30 bg-[var(--glass-bg)] p-5 backdrop-blur-xl shadow-xl transition-all duration-300 ${stageGlow[item.status]}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.38),transparent_42%)]" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="relative grid h-14 w-14 place-items-center rounded-full">
            <span className="absolute inset-0 rounded-full bg-[var(--primary)] p-[2px]" />
            <span className="relative grid h-[52px] w-[52px] place-items-center rounded-full bg-white/20 text-sm font-bold text-white">
              {initials}
            </span>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-white/80">{item.company} | {item.location}</p>
          <h3 className="bg-[var(--sunset-text)] bg-clip-text text-2xl font-bold text-transparent">{item.jobTitle}</h3>
        </div>

        <div className="flex items-center justify-between gap-4">
          <ProgressRing progress={stageProgress[item.status]} gradientId={`job-gradient-${index}`} />
          <div className="min-w-0 space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Next action</p>
            <p className="text-sm leading-snug text-white/90">{item.nextAction}</p>
          </div>
        </div>

        <button
          type="button"
          className="group/button relative isolate w-full overflow-hidden rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02]"
        >
          <span className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/button:opacity-100 bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,transparent_60%)]" />
          <span className="absolute left-1/2 top-1/2 -z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 opacity-0 blur-md transition-all duration-500 group-hover/button:h-40 group-hover/button:w-40 group-hover/button:opacity-30" />
          Next Action
        </button>
      </div>
    </motion.article>
  );
}
