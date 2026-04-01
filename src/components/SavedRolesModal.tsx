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
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors shadow-sm"
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
                            className="relative z-[91] w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-lg font-black uppercase tracking-widest text-gray-900 dark:text-gray-100 font-outfit">Saved Roles</h2>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
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
