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
                        className="premium-card relative w-full max-w-md rounded-2xl bg-white p-8"
                    >
                        <div className="modal-grain" />
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-[#78716C] hover:text-[#1C1917] transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
                                <AlertCircle size={24} className="text-red-600" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-[#1C1917]">{title}</h3>
                                <p className="text-sm font-medium text-[#78716C] leading-relaxed">{message}</p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={onClose}
                                    className="subtle-control flex-1 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-[#1C1917] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="flex-1 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-[#1C1917] hover:bg-black transition-all hover:scale-[1.02] active:scale-95"
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
