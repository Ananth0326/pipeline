import { motion } from 'framer-motion';

type ProgressRingProps = {
  progress: number;
  gradientId: string;
};

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing({ progress, gradientId }: ProgressRingProps) {
  const clampedProgress = Math.max(0, Math.min(progress, 100));
  const targetOffset = CIRCUMFERENCE - (clampedProgress / 100) * CIRCUMFERENCE;

  return (
    <div className="relative h-24 w-24">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80" fill="none" aria-label={`Application progress ${clampedProgress}%`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r={RADIUS} stroke="rgba(255,255,255,0.16)" strokeWidth="8" />
        <motion.circle
          cx="40"
          cy="40"
          r={RADIUS}
          stroke={`url(#${gradientId})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-semibold text-white">{clampedProgress}%</span>
    </div>
  );
}
