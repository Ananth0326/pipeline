import { motion } from 'framer-motion';
import { JobStatus } from './types';

type StatusBadgeProps = {
  status: JobStatus;
};

const statusMap: Record<JobStatus, { icon: string; classes: string }> = {
  Pending: {
    icon: '?',
    classes: 'bg-orange-500/20 text-orange-200 border-orange-400/50',
  },
  Interview: {
    icon: '??',
    classes: 'bg-sky-500/20 text-sky-200 border-sky-400/50',
  },
  Offer: {
    icon: '?',
    classes: 'bg-green-500/20 text-green-200 border-green-400/50',
  },
  Rejected: {
    icon: '?',
    classes: 'bg-rose-500/20 text-rose-200 border-rose-400/50',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { icon, classes } = statusMap[status];

  return (
    <motion.span
      whileHover={{ scale: 1.06 }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md transition-all duration-300 hover:brightness-125 hover:saturate-150 animate-status-pulse ${classes}`}
    >
      <span>{icon}</span>
      <span>{status}</span>
    </motion.span>
  );
}
