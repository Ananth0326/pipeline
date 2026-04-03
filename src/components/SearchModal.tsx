'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Building2, Briefcase } from 'lucide-react';
import { Company } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
    companies: Company[];
}

export default function SearchModal({ companies }: SearchModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    const onClose = () => setIsOpen(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-search', handleOpen);
        return () => window.removeEventListener('open-search', handleOpen);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) setQuery('');
    }, [isOpen]);

    const filtered = query.trim() === ''
        ? []
        : companies.filter(c =>
            c.company_name.toLowerCase().includes(query.toLowerCase()) ||
            c.role_title.toLowerCase().includes(query.toLowerCase()) ||
            (c.notes && c.notes.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 5);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100]"
                    />

                    <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-[#161616] w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden pointer-events-auto"
                        >
                            <div className="flex items-center px-4 py-3 border-b border-white/10">
                                <Search size={20} className="text-[#E1E1E1]/60 mr-3" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search companies, roles, or notes..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-base text-[#E1E1E1] placeholder:text-[#E1E1E1]/45 placeholder:font-medium"
                                />
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-md text-[#E1E1E1]/60 hover:text-[#E1E1E1] hover:bg-white/10 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto">
                                {query.trim() !== '' && filtered.length === 0 && (
                                    <div className="p-8 text-center text-sm text-[#E1E1E1]/60">
                                        No results found for "{query}"
                                    </div>
                                )}

                                {query.trim() === '' && (
                                    <div className="p-8 text-center">
                                        <p className="text-xs font-bold tracking-widest uppercase text-[#E1E1E1]/60 mb-2">Quick Search</p>
                                        <p className="text-sm text-[#E1E1E1]/60">Type a company name or role to find applications instantly.</p>
                                    </div>
                                )}

                                {filtered.length > 0 && (
                                    <div className="p-2">
                                        <p className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mb-2">Results</p>
                                        <div className="space-y-1">
                                            {filtered.map(company => (
                                                <button
                                                    key={company.id}
                                                    onClick={() => {
                                                        router.push(`/company/${company.id}`);
                                                        onClose();
                                                    }}
                                                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors text-left group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#00F2FE]/20 border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE] shrink-0">
                                                            <Building2 size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[#E1E1E1]">{company.company_name}</p>
                                                            <div className="flex items-center gap-1.5 mt-0.5 opacity-70">
                                                                <Briefcase size={10} className="text-[#E1E1E1]/60" />
                                                                <p className="text-xs text-[#E1E1E1]/60">{company.role_title}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/70 bg-[#0A0A0A] border border-white/10 px-2 py-1 rounded">View</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="px-4 py-3 bg-[#0A0A0A] border-t border-white/10 flex items-center justify-between text-xs text-[#E1E1E1]/60">
                                <span className="flex items-center gap-1">Navigate with <span className="px-1.5 py-0.5 rounded border border-white/10 bg-[#161616] font-mono leading-none">UP</span><span className="px-1.5 py-0.5 rounded border border-white/10 bg-[#161616] font-mono leading-none">DOWN</span></span>
                                <span><span className="px-1.5 py-0.5 rounded border border-white/10 bg-[#161616] font-mono leading-none mr-1">Esc</span> to close</span>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
