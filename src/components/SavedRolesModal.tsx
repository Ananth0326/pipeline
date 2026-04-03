'use client';

import { SavedRole } from '@/lib/types';
import { Bookmark, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SavedRolesSection from './SavedRolesSection';

interface SavedRolesModalProps {
    savedRoles: SavedRole[];
}

export default function SavedRolesModal({ savedRoles }: SavedRolesModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#161616] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#E1E1E1] hover:bg-[#1d1d1d] transition-colors"
            >
                <Bookmark size={14} /> Saved Roles
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative z-[91] w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-[#161616] flex flex-col"
                        >
                            <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/10">
                                <h2 className="text-lg font-black uppercase tracking-widest text-[#E1E1E1] font-outfit">Saved Roles</h2>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-full p-2 text-[#E1E1E1]/70 hover:bg-white/10 hover:text-[#E1E1E1] transition-colors"
                                    aria-label="Close saved roles"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 md:p-8 minimal-scrollbar">
                                <SavedRolesSection savedRoles={savedRoles} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
