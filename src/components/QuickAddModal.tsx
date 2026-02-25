'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import CompanyForm from './CompanyForm';
import { addCompany } from '@/lib/actions';

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
                className="hidden md:flex fixed bottom-8 right-8 w-14 h-14 bg-[#66D19E] hover:bg-[#58C28E] text-[#064E3B] rounded-full items-center justify-center shadow-xl shadow-green-500/20 hover:scale-110 active:scale-95 transition-all z-40 group border border-[#4FB886]"
                title="Add Application (Press 'A')"
            >
                <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* MODAL / BOTTOM SHEET OVERLAY */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex md:items-center items-end justify-center">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => !isSubmitting && setIsOpen(false)}
                    />

                    <div className="relative bg-white dark:bg-black w-full max-w-2xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl border-t md:border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom md:zoom-in duration-300">
                        {/* Mobile Pull Handle */}
                        <div className="md:hidden flex justify-center py-3">
                            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full" />
                        </div>

                        <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md px-8 py-6 md:p-6 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-xl font-black tracking-tighter uppercase font-outfit">Quick Add</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">New Application Entry</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                disabled={isSubmitting}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 pb-12 md:pb-8">
                            <CompanyForm
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
