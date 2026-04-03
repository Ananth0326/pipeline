'use client';

import { Company } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { deleteCompany } from '@/lib/actions';
import { Trash2, ExternalLink, Target, PieChart, Users, CheckCircle2, MoreVertical, ChevronUp, ChevronDown, LayoutList, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from './ConfirmModal';
import KanbanBoard from './KanbanBoard';

interface CompanyTableProps {
    companies: Company[];
}

export default function CompanyTable({ companies }: CompanyTableProps) {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteName, setDeleteName] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

    const activeCount = companies.filter(c => c.status_color === 'yellow' || c.status_color === 'green').length;
    const offerCount = companies.filter(c => c.status_color === 'green' && c.status_text.toLowerCase().includes('offer')).length;
    const rejectedCount = companies.filter(c => c.status_color === 'red').length;

    const getStatusParts = (company: Company) => {
        const colorMap: Record<'green' | 'yellow' | 'red' | 'orange' | 'purple' | 'blue', string> = {
            green: 'bg-[#00E676]/20 text-[#00E676] border-[#00E676]/60 shadow-[0_0_16px_rgba(0,230,118,0.35)]',
            yellow: 'bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]/60',
            red: 'bg-[#FF1744]/20 text-[#FF1744] border-[#FF1744]/60',
            orange: 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/60',
            purple: 'bg-[#A16EFF]/20 text-[#A16EFF] border-[#A16EFF]/60',
            blue: 'bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]/60',
        };

        return {
            primary: (company.status_text || 'Applied').toUpperCase(),
            color: colorMap[company.status_color as keyof typeof colorMap] || colorMap.yellow
        };
    };

    const getStatusHoverShadow = (statusColor?: string) => {
        const map: Record<string, string> = {
            blue: 'hover:shadow-[0_14px_28px_rgba(0,242,254,0.15)]',
            yellow: 'hover:shadow-[0_14px_28px_rgba(0,242,254,0.15)]',
            orange: 'hover:shadow-[0_14px_28px_rgba(255,184,0,0.15)]',
            purple: 'hover:shadow-[0_14px_28px_rgba(161,110,255,0.15)]',
            green: 'hover:shadow-[0_14px_28px_rgba(0,230,118,0.15)]',
            red: 'hover:shadow-[0_14px_28px_rgba(255,23,68,0.15)]',
        };
        return map[statusColor || 'yellow'] || map.yellow;
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await deleteCompany(deleteId);
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* DASHBOARD STATS */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#161616]/80 p-4 rounded-2xl border border-white/10 flex items-center gap-4 backdrop-blur-md">
                        <div className="w-10 h-10 rounded-xl bg-[#00F2FE]/20 border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE] shrink-0">
                            <Users size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/70">Total Apps</p>
                            <p className="text-2xl font-black font-outfit leading-none mt-1">{companies.length}</p>
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#161616]/80 p-4 rounded-2xl border border-white/10 flex items-center gap-4 backdrop-blur-md">
                        <div className="w-10 h-10 rounded-xl bg-[#A16EFF]/20 border border-[#A16EFF]/40 flex items-center justify-center text-[#A16EFF] shrink-0">
                            <Target size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/70">Active</p>
                            <p className="text-2xl font-black font-outfit text-[#A16EFF] leading-none mt-1">{activeCount}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#161616]/80 p-4 rounded-2xl border border-white/10 flex items-center gap-4 backdrop-blur-md">
                        <div className="w-10 h-10 rounded-xl bg-[#00E676]/20 border border-[#00E676]/40 flex items-center justify-center text-[#00E676] shrink-0 shadow-[0_0_14px_rgba(0,230,118,0.35)]">
                            <CheckCircle2 size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/70">Offers</p>
                            <p className="text-2xl font-black text-[#00E676] font-outfit leading-none mt-1">{offerCount}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#161616]/80 p-4 rounded-2xl border border-white/10 flex items-center gap-4 backdrop-blur-md">
                        <div className="w-10 h-10 rounded-xl bg-[#FF1744]/20 border border-[#FF1744]/40 flex items-center justify-center text-[#FF1744] shrink-0">
                            <PieChart size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/70">Rejected</p>
                            <p className="text-2xl font-black text-[#FF1744] font-outfit leading-none mt-1">{rejectedCount}</p>
                        </div>
                    </motion.div>
                </div>

                {/* VIEW CONTROLS & SUMMARY LINE */}
                <div className="flex items-center justify-between px-1 mb-2 mt-6">
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E1E1E1]/60">Overview</p>
                        <div className="hidden sm:block flex-1 w-32 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
                    </div>
                    
                    <div className="flex items-center bg-[#161616] rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-black text-[#E1E1E1] border border-white/10' : 'text-[#E1E1E1]/60 hover:text-[#00F2FE]'}`}
                        >
                            <LayoutList size={14} />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'kanban' ? 'bg-black text-[#E1E1E1] border border-white/10' : 'text-[#E1E1E1]/60 hover:text-[#00F2FE]'}`}
                        >
                            <LayoutGrid size={14} />
                            Board
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'kanban' ? (
                    <motion.div
                        key="kanban"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <KanbanBoard companies={companies} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {/* DESKTOP TABLE VIEW */}
                        <div className="hidden md:block overflow-hidden rounded-lg border border-white/10 bg-[#161616] mb-8">
                            <div className="relative">
                                <div className="w-full overflow-auto">
                                    <table className="group/table w-full caption-bottom text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-[#0F0F0F]">
                                                <th className="h-10 px-4 text-left align-middle text-[#E1E1E1]/60 font-medium">
                                                    <button className="group/sort flex items-center gap-1 uppercase tracking-widest text-[9px] font-bold">
                                                        Company & Role
                                                    </button>
                                                </th>
                                                <th className="h-10 px-4 text-left align-middle uppercase tracking-widest text-[9px] font-bold text-[#E1E1E1]/60">Status</th>
                                                <th className="hidden lg:table-cell h-10 px-4 text-left align-middle uppercase tracking-widest text-[9px] font-bold text-[#E1E1E1]/60">Next Action</th>
                                                <th className="hidden md:table-cell h-10 px-4 text-left align-middle uppercase tracking-widest text-[9px] font-bold text-[#E1E1E1]/60">Created</th>
                                                <th className="hidden xl:table-cell h-10 px-4 text-left align-middle uppercase tracking-widest text-[9px] font-bold text-[#E1E1E1]/60">Activity</th>
                                                <th className="h-10 px-4 text-right align-middle"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <AnimatePresence>
                                                {companies.map((company, i) => {
                                                    const { primary, color } = getStatusParts(company);
                                                    return (
                                                        <motion.tr
                                                            key={company.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ delay: i * 0.03, duration: 0.2 }}
                                                            onClick={() => router.push(`/company/${company.id}`)}
                                                            className={`border-b border-white/10 last:border-0 hover:bg-white/[0.03] hover:border-white/50 hover:[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.5)] ${getStatusHoverShadow(company.status_color)} cursor-pointer transition-all group`}
                                                        >
                                                            <td className="p-4 align-middle">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-8 h-8 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[#E1E1E1]/70 font-bold text-[10px] border border-white/10 uppercase">{company.company_name.charAt(0)}</div>
                                                                    <div className="flex flex-col">
                                                                        <h5 className="text-sm font-medium text-[#E1E1E1] leading-none">{company.company_name}</h5>
                                                                        <button className="inline-flex items-center gap-x-1 border border-transparent border-dashed rounded transition-all hover:bg-white/[0.04] hover:border-white/10 font-mono text-[10px] text-[#E1E1E1]/60 hover:text-[#00F2FE] px-1 -ml-1 mt-1.5 w-fit">
                                                                            {company.role_title.replace(/\s+/g, '-')}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 align-middle">
                                                                <div className={`inline-flex items-center gap-1 justify-center rounded-md tracking-[0.07em] uppercase font-bold text-[9px] px-[6px] py-[4px] border ${color}`}>{primary}</div>
                                                            </td>
                                                            <td className="hidden lg:table-cell p-4 align-middle">
                                                                <div className="inline-flex items-center justify-center rounded-md font-mono uppercase font-medium tracking-[0.06em] text-[10px] px-[5.5px] py-[3px] bg-[#0A0A0A] text-[#E1E1E1]/70 border border-white/10">{company.next_action || 'none'}</div>
                                                            </td>
                                                            <td className="hidden md:table-cell p-4 align-middle">
                                                                <span className="font-mono text-[10px] text-[#E1E1E1]/60">{new Date(company.date_applied).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                            </td>
                                                            <td className="hidden xl:table-cell p-4 align-middle">
                                                                <span className="font-mono text-[10px] text-[#E1E1E1]/60">{new Date(company.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                                            </td>
                                                            <td className="p-4 align-middle text-right">
                                                                <button className="h-[26px] w-7 inline-flex items-center justify-center rounded-md border border-white/10 bg-[#0A0A0A] text-[#E1E1E1]/60 opacity-0 group-hover:opacity-100 transition-all"><MoreVertical size={14} /></button>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* MOBILE CARD VIEW */}
                        <div className="md:hidden space-y-4">
                            <AnimatePresence>
                                {companies.map((company, i) => {
                                    const { primary, color } = getStatusParts(company);
                                    return (
                                        <motion.div
                                            key={company.id}
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => router.push(`/company/${company.id}`)}
                                            className={`bg-[#161616] border border-white/10 hover:border-white/50 rounded-[2rem] p-6 active:scale-[0.98] transition-all ${getStatusHoverShadow(company.status_color)} flex justify-between items-center group backdrop-blur-md relative overflow-hidden`}
                                        >
                                            <div className="flex items-center gap-4 relative z-10 w-full">
                                                <div className="hidden xs:flex w-11 h-11 rounded-full bg-gray-50 dark:bg-gray-900 items-center justify-center text-gray-400 font-black text-xs border border-gray-100 dark:border-gray-800 uppercase shrink-0">{company.company_name.charAt(0)}</div>
                                                <div className="space-y-1.5 flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-[6px] py-[3px] rounded-md text-[9px] font-black tracking-widest uppercase border ${color}`}>{primary}</span>
                                                        <span className="text-[10px] font-bold text-[#E1E1E1]/60 font-mono">{new Date(company.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}</span>
                                                    </div>
                                                    <h3 className="text-base font-bold text-[#E1E1E1] font-inter leading-none truncate">{company.company_name}</h3>
                                                    <div className="text-[10px] font-medium text-[#E1E1E1]/60 font-mono tracking-tight lowercase truncate opacity-70">{company.role_title.replace(/\s+/g, '-')}</div>
                                                </div>
                                                <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-[#E1E1E1]/60 shrink-0"><MoreVertical size={16} /></div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {companies.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-16 text-center text-sm font-medium text-[#E1E1E1]/70 bg-[#161616]/70 backdrop-blur-sm rounded-3xl border border-dashed border-white/20">
                                No applications tracked yet. Click "Add Application" to get started!
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title={`Delete ${deleteName}?`} message="This will permanently remove this application and all associated activity logs. This action cannot be undone." />
        </div>
    );
}
