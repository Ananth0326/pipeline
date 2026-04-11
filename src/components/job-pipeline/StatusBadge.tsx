import { motion } from 'framer-motion';
import { JobStatus } from './types';

type StatusBadgeProps = {
  status: JobStatus;
};

const statusMap: Record<JobStatus, { icon: string; classes: string; ring: string }> = {
  Applied: {
    icon: '\u23f3',
    classes: 'text-amber-100 bg-amber-300/20',
    ring: 'from-amber-400 to-yellow-300',
  },
  Interview: {
    icon: '\ud83c\udfa4',
    classes: 'text-sky-100 bg-blue-300/20',
    ring: 'from-blue-400 to-sky-300',
  },
  Offer: {
    icon: '\u2728',
    classes: 'text-emerald-100 bg-emerald-300/20',
    ring: 'from-emerald-400 to-green-300',
  },
  Rejected: {
    icon: '\u274c',
    classes: 'text-rose-100 bg-rose-300/20',
    ring: 'from-rose-400 to-red-300',
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
      <span className={`absolute -inset-[1px] rounded-full bg-gradient-to-r ${ring} opacity-90`} />
      <span
        className={`relative inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1 text-xs font-semibold backdrop-blur-xl animate-status-pulse ${classes}`}
      >
        <span>{icon}</span>
        <span>{status}</span>
      </span>
    </motion.div>
  );
}
