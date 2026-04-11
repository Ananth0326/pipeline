import { motion } from 'framer-motion';
import { JobStatus } from './types';

type StatusBadgeProps = {
  status: JobStatus;
};

const statusMap: Record<JobStatus, { icon: string; classes: string; ring: string }> = {
  Applied: {
    icon: '\u23f3',
    classes: 'text-slate-600 bg-slate-100',
    ring: 'from-slate-200 to-slate-300',
  },
  Interview: {
    icon: '\ud83c\udfa4',
    classes: 'text-blue-700 bg-blue-50',
    ring: 'from-blue-100 to-sky-100',
  },
  Offer: {
    icon: '\u2728',
    classes: 'text-emerald-700 bg-emerald-50',
    ring: 'from-emerald-100 to-green-100',
  },
  Rejected: {
    icon: '\u274c',
    classes: 'text-rose-700 bg-rose-50',
    ring: 'from-rose-100 to-red-100',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { icon, classes, ring } = statusMap[status];

  return (
    <motion.div
      key={status}
      initial={{ rotate: -6, scale: 0.95, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.35 }}
      whileHover={{ scale: 1.06, rotate: 2 }}
      className="relative inline-flex"
    >
      <span className={`absolute -inset-[1px] rounded-full bg-gradient-to-r ${ring} opacity-100`} />
      <span
        className={`relative inline-flex items-center gap-1.5 rounded-full border border-black/5 px-3 py-1 text-xs font-semibold animate-status-pulse ${classes}`}
      >
        <span>{icon}</span>
        <span>{status}</span>
      </span>
    </motion.div>
  );
}
