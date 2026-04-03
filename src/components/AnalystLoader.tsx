'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface AnalystLoaderProps {
    isOpen: boolean;
}

export default function AnalystLoader({ isOpen }: AnalystLoaderProps) {
    const [gifSrc, setGifSrc] = useState('/analyst.gif');
    const [mounted, setMounted] = useState(false);
    const [showScanBeam, setShowScanBeam] = useState(false);
    const wasOpenRef = useRef(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setGifSrc(`/analyst.gif?ts=${Date.now()}`);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            wasOpenRef.current = true;
            return;
        }

        if (wasOpenRef.current) {
            wasOpenRef.current = false;
            setShowScanBeam(true);
            document.documentElement.classList.add('scan-printing');

            const beamTimeout = setTimeout(() => {
                setShowScanBeam(false);
            }, 650);

            const classTimeout = setTimeout(() => {
                document.documentElement.classList.remove('scan-printing');
            }, 900);

            return () => {
                clearTimeout(beamTimeout);
                clearTimeout(classTimeout);
                document.documentElement.classList.remove('scan-printing');
            };
        }
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <>
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

            <AnimatePresence>
                {showScanBeam && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="fixed inset-0 z-[99] pointer-events-none"
                    >
                        <motion.div
                            initial={{ y: '-4px' }}
                            animate={{ y: 'calc(100vh + 4px)' }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                            className="absolute left-0 right-0 h-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
        ,
        document.body
    );
}
