'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface GifOverlayProps {
    isOpen: boolean;
}

export default function GifOverlay({ isOpen }: GifOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="fixed bottom-6 right-6 z-[9999] pointer-events-none"
                >
                    <img
                        src="/giphy.gif"
                        alt="Auto-apply in progress"
                        className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-2xl border border-white/30 shadow-2xl"
                        // Appending a random timestamp ensures the gif restarts from frame 1 every time it opens.
                        key={Date.now()}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
