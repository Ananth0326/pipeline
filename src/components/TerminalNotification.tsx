'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface TerminalNotificationProps {
    isOpen: boolean;
    companyName: string;
    roleTitle?: string;
    onApplyNow: () => void;
    onSkip: () => void;
}

export default function TerminalNotification({
    isOpen,
    companyName,
    roleTitle,
    onApplyNow,
    onSkip,
}: TerminalNotificationProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    initial={{ x: 420, opacity: 0.6 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 420, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.7 }}
                    className="fixed right-4 md:right-8 top-20 md:top-24 z-[120] w-[min(92vw,460px)] border border-white/5 border-l-[4px] border-l-cyan-500 bg-[#000000]/88 backdrop-blur-[12px] rounded-xl p-4 shadow-[0_0_28px_rgba(6,182,212,0.24)]"
                    role="alert"
                    aria-live="assertive"
                >
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-400/95">
                        System Alert // Stagnant Role
                    </p>

                    <div className="mt-3 space-y-1">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Company</p>
                        <p className="font-mono text-base font-semibold text-white break-words">{companyName}</p>
                    </div>

                    <div className="mt-3 space-y-1">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Role</p>
                        <p className="font-mono text-sm text-white/90 break-words">
                            {roleTitle?.trim() || 'Untitled Role'}
                        </p>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onApplyNow}
                            className="font-mono text-[11px] uppercase tracking-[0.14em] px-3 py-2 rounded-md border border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 transition-colors"
                        >
                            Apply Now [Space]
                        </button>
                        <button
                            type="button"
                            onClick={onSkip}
                            className="font-mono text-[11px] uppercase tracking-[0.14em] px-3 py-2 rounded-md border border-white/20 text-white/65 hover:text-white hover:border-white/40 transition-colors"
                        >
                            Skip
                        </button>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
