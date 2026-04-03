'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface AnalystLoaderProps {
    isOpen: boolean;
}

export default function AnalystLoader({ isOpen }: AnalystLoaderProps) {
    const [gifSrc, setGifSrc] = useState('/analyst.gif');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setGifSrc(`/analyst.gif?ts=${Date.now()}`);
        }
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl"
                >
                    <div className="flex flex-col items-center">
                        <img
                            src={gifSrc}
                            alt="Analyst loader"
                            className="w-[450px] max-w-[90vw] border border-white object-cover grayscale contrast-[1.5] shadow-[0_0_30px_rgba(0,230,118,0.28)]"
                        />
                        <p className="mt-4 animate-pulse font-mono text-xs uppercase tracking-[0.3em] text-white/90">
                            LOGGING ENTRY TO LEDGER...
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        ,
        document.body
    );
}
