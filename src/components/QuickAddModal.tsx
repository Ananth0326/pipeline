'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import CompanyForm from './CompanyForm';
import { addCompany } from '@/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickAddModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only trigger if not in an input/textarea
            if (
                e.key.toLowerCase() === 'a' &&
                !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
            ) {
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSubmit = async (data: any, resumeFile: File | null) => {
        setIsSubmitting(true);
        try {
            let resumeData = undefined;
            if (resumeFile) {
                const buffer = await resumeFile.arrayBuffer();
                resumeData = {
                    name: resumeFile.name,
                    type: resumeFile.type,
                    buffer
                };
            }
            await addCompany(data, resumeData);
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to add company:', error);
            alert('Failed to save application.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="hidden md:flex fixed bottom-8 right-8 w-14 h-14 bg-[#1C1917] hover:bg-black text-white rounded-full items-center justify-center shadow-[0_20px_25px_-5px_rgba(0,0,0,0.12)] hover:scale-110 active:scale-95 transition-all z-40 group border border-black/10"
                title="Add Application (Press 'A')"
            >
                <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* MODAL / BOTTOM SHEET OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex md:items-center items-end justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => !isSubmitting && setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="premium-card relative flex h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2.5rem] bg-[#FDFCFB] md:h-[88vh] md:rounded-[2.5rem]"
                        >
                            <div className="modal-grain" />
                            {/* Mobile Pull Handle */}
                            <div className="md:hidden shrink-0 flex justify-center py-3">
                                <div className="w-12 h-1.5 bg-black/20 rounded-full" />
                            </div>

                            <div className="sticky top-0 shrink-0 bg-[#FDFCFB]/95 backdrop-blur-md px-8 py-6 md:p-6 border-b border-black/10 flex justify-between items-center z-10">
                                <div>
                                    <h2 className="text-xl font-black tracking-tighter uppercase font-outfit text-[#1C1917]">Quick Add</h2>
                                    <p className="text-[10px] font-bold text-[#78716C] uppercase tracking-widest font-sans">New Application Entry</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    disabled={isSubmitting}
                                    className="p-2 hover:bg-black/5 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="minimal-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
                                <CompanyForm
                                    onSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                    compact
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
