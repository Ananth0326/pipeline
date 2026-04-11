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
                    className="fixed right-4 md:right-8 top-20 md:top-24 z-[120] w-[min(92vw,460px)] overflow-hidden rounded-xl border border-black/5 border-l-[4px] border-l-[#D4AF37] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_20px_rgba(0,0,0,0.03)]"
                    role="alert"
                    aria-live="assertive"
                >
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                        }}
                    />
                    <p className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-[#78716C]">
                        Premium Nudge // Stagnant Role
                    </p>

                    <div className="relative mt-3 space-y-1">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#78716C]">Company</p>
                        <p className="font-mono text-base font-semibold text-[#1C1917] break-words">{companyName}</p>
                    </div>

                    <div className="relative mt-3 space-y-1">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#78716C]">Role</p>
                        <p className="font-mono text-sm text-[#1C1917] break-words">
                            {roleTitle?.trim() || 'Untitled Role'}
                        </p>
                    </div>

                    <div className="relative mt-5 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onApplyNow}
                            className="font-mono text-[11px] uppercase tracking-[0.14em] px-3 py-2 rounded-md border border-black/10 text-[#1C1917] hover:bg-[#F8F7F4] transition-colors"
                        >
                            Apply Now [Space]
                        </button>
                        <button
                            type="button"
                            onClick={onSkip}
                            className="font-mono text-[11px] uppercase tracking-[0.14em] px-3 py-2 rounded-md border border-black/10 text-[#78716C] hover:text-[#1C1917] hover:bg-[#F8F7F4] transition-colors"
                        >
                            Skip
                        </button>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
