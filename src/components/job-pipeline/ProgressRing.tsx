import { motion } from 'framer-motion';

type ProgressRingProps = {
  progress: number;
  gradientId: string;
  startColor: string;
  endColor: string;
};

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing({ progress, gradientId, startColor, endColor }: ProgressRingProps) {
  const clampedProgress = Math.max(0, Math.min(progress, 100));
  const targetOffset = CIRCUMFERENCE - (clampedProgress / 100) * CIRCUMFERENCE;

  return (
    <div className="relative h-24 w-24">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80" fill="none" aria-label={`Pipeline progress ${clampedProgress}%`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r={RADIUS} stroke="rgba(0,0,0,0.08)" strokeWidth="8" />
        <motion.circle
          cx="40"
          cy="40"
          r={RADIUS}
          stroke={`url(#${gradientId})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          whileInView={{ strokeDashoffset: targetOffset }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-semibold text-[#1C1917]">{clampedProgress}%</span>
    </div>
  );
}
