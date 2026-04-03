'use client';

import { X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-[#161616] w-full max-w-md rounded-3xl border border-white/10 p-8"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-[#E1E1E1]/60 hover:text-[#E1E1E1] transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#FF1744]/20 border border-[#FF1744]/40 flex items-center justify-center">
                                <AlertCircle size={24} className="text-[#FF1744]" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-[#E1E1E1]">{title}</h3>
                                <p className="text-sm font-medium text-[#E1E1E1]/65 leading-relaxed">{message}</p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-[#E1E1E1]/70 border border-white/10 hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="flex-1 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-[#FF1744] hover:bg-[#ff3f66] transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
