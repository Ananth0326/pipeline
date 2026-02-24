'use client';

import { X, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-950 w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 animate-in zoom-in-95 fade-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                        <AlertCircle size={24} className="text-red-500" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-gray-100">{title}</h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">{message}</p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
