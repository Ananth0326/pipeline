'use client';

import { Company, ApplicationStatus } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { deleteCompany } from '@/lib/actions';
import { Trash2, ExternalLink, Target, PieChart, Users, CheckCircle2, MoreVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

interface CompanyTableProps {
    companies: Company[];
}

export default function CompanyTable({ companies }: CompanyTableProps) {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteName, setDeleteName] = useState('');

    const activeCount = companies.filter(c => c.status_color === 'yellow' || c.status_color === 'green').length;
    const offerCount = companies.filter(c => c.status_color === 'green' && c.status_text.toLowerCase().includes('offer')).length;
    const rejectedCount = companies.filter(c => c.status_color === 'red').length;

    const getStatusParts = (company: Company) => {
        const colorMap: Record<'green' | 'yellow' | 'red', string> = {
            green: 'bg-green-50/50 text-green-600 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800',
            yellow: 'bg-yellow-50/50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-800',
            red: 'bg-red-50/50 text-red-600 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800',
        };

        return {
            primary: company.status_text.toUpperCase() || 'APPLIED',
            color: colorMap[company.status_color] || colorMap.yellow
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
                    <div className="bg-gray-50/50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                            <Users size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total</p>
                            <p className="text-xl font-black font-outfit leading-none mt-1">{companies.length}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                            <CheckCircle2 size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Offers</p>
                            <p className="text-xl font-black text-green-600 font-outfit leading-none mt-1">{offerCount}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                            <PieChart size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Rejected</p>
                            <p className="text-xl font-black text-red-600 font-outfit leading-none mt-1">{rejectedCount}</p>
                        </div>
                    </div>
                </div>

                {/* SUMMARY LINE */}
                <div className="flex items-center gap-2 px-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                        {companies.length} Apps • {activeCount} Pipelined • {offerCount} Offers • {rejectedCount} Rejected
                    </p>
                    <div className="flex-1 h-[1px] bg-gray-50 bg-gradient-to-r from-gray-100/50 to-transparent" />
                </div>
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-black shadow-sm mb-8">
                <div className="relative">
                    <div className="absolute inset-0 pointer-events-none z-[38] before:absolute before:top-0 before:right-0 before:bottom-0 before:w-6 before:bg-gradient-to-l before:from-black/5 dark:before:from-black/20 before:to-transparent before:opacity-0 transition-opacity after:absolute after:top-0 after:left-0 after:bottom-0 after:w-6 after:bg-gradient-to-r after:from-black/5 dark:after:from-black/20 after:to-transparent after:opacity-0 transition-opacity"></div>
                    <div className="w-full overflow-auto">
                        <table className="group/table w-full caption-bottom text-sm border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50/50 dark:bg-gray-950">
                                    <th className="h-10 px-4 text-left align-middle text-gray-400 font-medium">
                                        <button className="group/sort flex items-center gap-1 uppercase tracking-widest text-[9px] font-bold">
                                            Company & Role
                                            <div className="w-3 h-3 relative overflow-hidden opacity-0 group-hover/sort:opacity-100">
                                                <ChevronUp size={12} className="absolute inset-0" />
                                                <ChevronDown size={12} className="absolute inset-0" />
                                            </div>
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
                                {companies.map((company) => {
                                    const { primary, color } = getStatusParts(company);
                                    return (
                                        <tr key={company.id} onClick={() => router.push(`/company/${company.id}`)} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors group">
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
                                                <div className={`inline-flex items-center gap-1 justify-center rounded-full tracking-[0.07em] uppercase font-bold text-[9px] px-[5.5px] py-[3px] bg-opacity-10 border ${color}`}>{primary}</div>
                                            </td>
                                            <td className="hidden lg:table-cell p-4 align-middle">
                                                <div className="inline-flex items-center justify-center rounded-md font-mono uppercase font-medium tracking-[0.06em] text-[10px] px-[5.5px] py-[3px] bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-800 bg-opacity-50">{company.next_action || 'none'}</div>
                                            </td>
                                            <td className="hidden md:table-cell p-4 align-middle">
                                                <span className="text-sm text-gray-400">{new Date(company.date_applied).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
                                            </td>
                                            <td className="hidden xl:table-cell p-4 align-middle">
                                                <span className="text-sm text-gray-300">{new Date(company.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <button className="h-[26px] w-7 inline-flex items-center justify-center rounded-md border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-400 opacity-0 group-hover:opacity-100 transition-all"><MoreVertical size={14} /></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden space-y-4">
                {companies.map((company) => {
                    const { primary, color } = getStatusParts(company);
                    return (
                        <div key={company.id} onClick={() => router.push(`/company/${company.id}`)} className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-[2rem] p-6 active:scale-[0.98] transition-all flex justify-between items-center group border-l-4 border-l-transparent active:border-l-blue-500 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="hidden xs:flex w-11 h-11 rounded-full bg-gray-50 dark:bg-gray-900 items-center justify-center text-gray-400 font-black text-xs border border-gray-100 dark:border-gray-800 uppercase">{company.company_name.charAt(0)}</div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-[6px] py-[2.5px] rounded-full text-[9px] font-black tracking-widest uppercase border ${color}`}>{primary}</span>
                                        <span className="text-[10px] font-bold text-gray-300 font-mono">{new Date(company.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 font-inter leading-none">{company.company_name}</h3>
                                    <div className="text-[10px] font-medium text-gray-400 font-mono tracking-tight lowercase opacity-70">{company.role_title.replace(/\s+/g, '-')}</div>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-gray-300"><MoreVertical size={16} /></div>
                        </div>
                    );
                })}
            </div>

            {companies.length === 0 && (
                <div className="px-6 py-16 text-center text-sm text-gray-500 italic bg-gray-50/50 dark:bg-gray-950 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">No applications found. Add one to start tracking!</div>
            )}

            <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title={`Delete ${deleteName}?`} message="This will permanently remove this application and all associated activity logs. This action cannot be undone." />
        </div>
    );
}
