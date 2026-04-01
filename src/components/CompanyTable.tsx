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
            green: 'bg-green-50/50 text-green-600 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800',
            yellow: 'bg-yellow-50/50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-800',
            red: 'bg-red-50/50 text-red-600 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800',
            orange: 'bg-orange-50/50 text-orange-600 border-orange-200 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-800',
            purple: 'bg-purple-50/50 text-purple-600 border-purple-200 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-800',
            blue: 'bg-blue-50/50 text-blue-600 border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800',
        };

        return {
            primary: (company.status_text || 'Applied').toUpperCase(),
            color: colorMap[company.status_color as keyof typeof colorMap] || colorMap.yellow
        };
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
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm backdrop-blur-md">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                            <Users size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Apps</p>
                            <p className="text-2xl font-black font-outfit leading-none mt-1">{companies.length}</p>
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm backdrop-blur-md">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 shrink-0">
                            <Target size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active</p>
                            <p className="text-2xl font-black font-outfit text-purple-600 leading-none mt-1">{activeCount}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm backdrop-blur-md">
                        <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 shrink-0">
                            <CheckCircle2 size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Offers</p>
                            <p className="text-2xl font-black text-green-600 font-outfit leading-none mt-1">{offerCount}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm backdrop-blur-md">
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 shrink-0">
                            <PieChart size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rejected</p>
                            <p className="text-2xl font-black text-red-600 font-outfit leading-none mt-1">{rejectedCount}</p>
                        </div>
                    </motion.div>
                </div>

                {/* VIEW CONTROLS & SUMMARY LINE */}
                <div className="flex items-center justify-between px-1 mb-2 mt-6">
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Overview</p>
                        <div className="hidden sm:block flex-1 w-32 h-[1px] bg-gray-50 bg-gradient-to-r from-gray-100/50 to-transparent" />
                    </div>
                    
                    <div className="flex items-center bg-gray-50 dark:bg-gray-950 rounded-lg p-1 border border-gray-100 dark:border-gray-800 shadow-inner">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <LayoutList size={14} />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'kanban' ? 'bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
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
                        <div className="hidden md:block overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-black shadow-sm mb-8">
                            <div className="relative">
                                <div className="w-full overflow-auto">
                                    <table className="group/table w-full caption-bottom text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b bg-gray-50/50 dark:bg-gray-950">
                                                <th className="h-10 px-4 text-left align-middle text-gray-400 font-medium">
                                                    <button className="group/sort flex items-center gap-1 uppercase tracking-widest text-[9px] font-bold">
                                                        Company & Role
                                                    </button>
                                                </th>
                                                <th className="h-10 px-4 text-left align-middle uppercase tracking-widest text-[9px] font-bold text-gray-400">Status</th>
                                                <th className="hidden lg:table-cell h-10 px-4 text-left align-middle uppercase tracking-widest text-[9px] font-bold text-gray-400">Next Action</th>
                                                <th className="hidden md:table-cell h-10 px-4 text-left align-middle uppercase tracking-widest text-[9px] font-bold text-gray-400">Created</th>
                                                <th className="hidden xl:table-cell h-10 px-4 text-left align-middle uppercase tracking-widest text-[9px] font-bold text-gray-400">Activity</th>
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
                                                            className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors group"
                                                        >
                                                            <td className="p-4 align-middle">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 font-bold text-[10px] border border-gray-100 dark:border-gray-800 uppercase">{company.company_name.charAt(0)}</div>
                                                                    <div className="flex flex-col">
                                                                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none">{company.company_name}</h5>
                                                                        <button className="inline-flex items-center gap-x-1 border border-transparent border-dashed rounded transition-all hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 font-mono text-[10px] text-gray-400 hover:text-gray-600 px-1 -ml-1 mt-1.5 w-fit">
                                                                            {company.role_title.replace(/\s+/g, '-')}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 align-middle">
                                                                <div className={`inline-flex items-center gap-1 justify-center rounded-md tracking-[0.07em] uppercase font-bold text-[9px] px-[6px] py-[4px] border border-opacity-50 ${color}`}>{primary}</div>
                                                            </td>
                                                            <td className="hidden lg:table-cell p-4 align-middle">
                                                                <div className="inline-flex items-center justify-center rounded-md font-mono uppercase font-medium tracking-[0.06em] text-[10px] px-[5.5px] py-[3px] bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-800 bg-opacity-50">{company.next_action || 'none'}</div>
                                                            </td>
                                                            <td className="hidden md:table-cell p-4 align-middle">
                                                                <span className="font-mono text-[10px] text-gray-400">{new Date(company.date_applied).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                            </td>
                                                            <td className="hidden xl:table-cell p-4 align-middle">
                                                                <span className="font-mono text-[10px] text-gray-400">{new Date(company.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                                            </td>
                                                            <td className="p-4 align-middle text-right">
                                                                <button className="h-[26px] w-7 inline-flex items-center justify-center rounded-md border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-400 opacity-0 group-hover:opacity-100 transition-all"><MoreVertical size={14} /></button>
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
                                            className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-[2rem] p-6 active:scale-[0.98] transition-all flex justify-between items-center group shadow-sm backdrop-blur-md relative overflow-hidden"
                                        >
                                            <div className="flex items-center gap-4 relative z-10 w-full">
                                                <div className="hidden xs:flex w-11 h-11 rounded-full bg-gray-50 dark:bg-gray-900 items-center justify-center text-gray-400 font-black text-xs border border-gray-100 dark:border-gray-800 uppercase shrink-0">{company.company_name.charAt(0)}</div>
                                                <div className="space-y-1.5 flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-[6px] py-[3px] rounded-md text-[9px] font-black tracking-widest uppercase border ${color}`}>{primary}</span>
                                                        <span className="text-[10px] font-bold text-gray-300 font-mono">{new Date(company.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}</span>
                                                    </div>
                                                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 font-inter leading-none truncate">{company.company_name}</h3>
                                                    <div className="text-[10px] font-medium text-gray-400 font-mono tracking-tight lowercase truncate opacity-70">{company.role_title.replace(/\s+/g, '-')}</div>
                                                </div>
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-gray-300 shrink-0"><MoreVertical size={16} /></div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {companies.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-16 text-center text-sm font-medium text-gray-400 bg-gray-50/50 dark:bg-gray-950/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
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
