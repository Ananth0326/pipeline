'use client';

import { SavedRole } from '@/lib/types';
import { Bookmark, X } from 'lucide-react';
import { useState } from 'react';
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
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors"
            >
                <Bookmark size={14} /> Saved Roles
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative z-[91] w-full max-w-6xl max-h-[90vh] overflow-auto rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-black uppercase tracking-widest text-gray-700">Saved Roles</h2>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                aria-label="Close saved roles"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <SavedRolesSection savedRoles={savedRoles} />
                    </div>
                </div>
            )}
        </>
    );
}
