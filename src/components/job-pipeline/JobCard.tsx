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
    Applied: 'hover:shadow-[0_14px_34px_rgba(71,85,105,0.12)]',
    Interview: 'hover:shadow-[0_14px_34px_rgba(59,130,246,0.12)]',
    Offer: 'hover:shadow-[0_14px_34px_rgba(16,185,129,0.12)]',
    Rejected: 'hover:shadow-[0_14px_34px_rgba(239,68,68,0.1)]',
  };
  const stageRing: Record<JobStatus, { start: string; end: string }> = {
    Applied: { start: '#94A3B8', end: '#64748B' },
    Interview: { start: '#60A5FA', end: '#3B82F6' },
    Offer: { start: '#34D399', end: '#10B981' },
    Rejected: { start: '#F87171', end: '#EF4444' },
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
      className={`group premium-card relative overflow-hidden p-5 transition-all duration-300 ${stageGlow[item.status]}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(120,113,108,0.08),transparent_42%)]" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="relative grid h-14 w-14 place-items-center rounded-full">
            <span className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#E7E5E4,#D6D3D1)] p-[2px]" />
            <span className="relative grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-sm font-bold text-[#1C1917]">
              {initials}
            </span>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[#78716C]">{item.company} | {item.location}</p>
          <h3 className="bg-[linear-gradient(135deg,#44403C,#78716C)] bg-clip-text text-2xl font-bold text-transparent">{item.jobTitle}</h3>
        </div>

        <div className="flex items-center justify-between gap-4">
          <ProgressRing
            progress={stageProgress[item.status]}
            gradientId={`job-gradient-${index}`}
            startColor={stageRing[item.status].start}
            endColor={stageRing[item.status].end}
          />
          <div className="min-w-0 space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#78716C]">Next action</p>
            <p className="text-sm leading-snug text-[#1C1917]">{item.nextAction}</p>
          </div>
        </div>

        <button
          type="button"
          className="group/button subtle-control relative isolate w-full overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold hover:scale-[1.01]"
        >
          <span className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/button:opacity-100 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_0%,transparent_62%)]" />
          <span className="absolute left-1/2 top-1/2 -z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/20 opacity-0 blur-md transition-all duration-500 group-hover/button:h-40 group-hover/button:w-40 group-hover/button:opacity-20" />
          Next Action
        </button>
      </div>
    </motion.article>
  );
}
