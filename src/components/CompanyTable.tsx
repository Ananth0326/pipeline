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

    const activeCount = companies.filter(c => !['rejected', 'offer'].includes(c.status)).length;
    const offerCount = companies.filter(c => c.status === 'offer').length;
    const rejectedCount = companies.filter(c => c.status === 'rejected').length;

    const getStatusParts = (company: Company) => {
        const statusMap: Record<ApplicationStatus, { primary: string, color: string }> = {
            applied: { primary: 'APPLIED', color: 'bg-blue-50/50 text-blue-600 border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800' },
            interview: { primary: 'INTERVIEW', color: 'bg-yellow-50/50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-800' },
            rejected: { primary: 'REJECTED', color: 'bg-red-50/50 text-red-600 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800' },
            offer: { primary: 'OFFER', color: 'bg-green-50/50 text-green-600 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800' },
            selected: { primary: 'SELECTED', color: 'bg-indigo-50/50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/10 dark:text-indigo-400 dark:border-indigo-800' },
        };

        const { primary, color } = statusMap[company.status] || statusMap.applied;

        let secondary = '';
        if (company.status === 'selected' || company.status === 'interview') {
            if (company.interview_date) secondary = 'Interview Scheduled';
            else if (company.qualified === true) secondary = 'Qualified';
            else if (company.assessment_done) secondary = 'Assessment Done';
        }

        return { primary, secondary, color };
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
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Users size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total</p>
                            <p className="text-3xl font-black font-outfit leading-none mt-1">{companies.length}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                            <CheckCircle2 size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Offers</p>
                            <p className="text-3xl font-black text-green-600 font-outfit leading-none mt-1">{offerCount}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                            <PieChart size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Rejected</p>
                            <p className="text-3xl font-black text-red-600 font-outfit leading-none mt-1">{rejectedCount}</p>
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
            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-black shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                        <thead className="bg-gray-50/50 dark:bg-gray-950">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <button className="flex items-center gap-1 group/sort">
                                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 group-hover/sort:text-gray-600 transition-colors">Project</span>
                                        <div className="flex flex-col -gap-1 opacity-0 group-hover/sort:opacity-100 transition-opacity">
                                            <ChevronUp size={8} className="text-gray-400" />
                                            <ChevronDown size={8} className="text-gray-400" />
                                        </div>
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Status</th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Next Action</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Applied</th>
                                <th className="hidden xl:table-cell px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Activity</th>
                                <th className="px-6 py-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-950 bg-white dark:bg-black">
                            {companies.map((company) => {
                                const { primary, color } = getStatusParts(company);
                                return (
                                    <tr
                                        key={company.id}
                                        onClick={() => router.push(`/company/${company.id}`)}
                                        className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-all cursor-pointer group border-b border-gray-50 dark:border-gray-900 border-l-0 hover:border-l-4 hover:border-l-blue-500"
                                    >
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 dark:text-gray-500 font-black text-xs uppercase border border-gray-100 dark:border-gray-800 shadow-sm">
                                                    {company.company_name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-inter tracking-tight leading-none">
                                                        {company.company_name}
                                                    </div>
                                                    <div className="inline-flex items-center gap-1 group/slug cursor-pointer w-fit">
                                                        <span className="text-[10px] font-medium text-gray-400 font-mono tracking-tight lowercase opacity-70 border-b border-transparent border-dashed group-hover/slug:border-gray-400 group-hover/slug:text-gray-600 transition-all">
                                                            {company.role_title.replace(/\s+/g, '-')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className={`px-[7px] py-[3px] rounded-full text-[9px] font-black tracking-widest uppercase border ${color}`}>
                                                {primary}
                                            </span>
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-5 whitespace-nowrap">
                                            <div className="inline-flex items-center justify-center rounded-md text-center font-mono uppercase whitespace-nowrap font-medium tracking-[0.06em] text-[10px] leading-[1.1] px-[6px] py-[3px] bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-100 dark:border-gray-800">
                                                {company.next_action || 'none'}
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-5 whitespace-nowrap">
                                            <span className="text-xs font-bold text-gray-400 font-mono tracking-tighter">
                                                {new Date(company.date_applied).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="hidden xl:table-cell px-6 py-5 whitespace-nowrap text-xs font-bold text-gray-300 font-mono uppercase tracking-tighter">
                                            {new Date(company.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <button className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md text-gray-400 hover:text-gray-600 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800 shadow-sm opacity-0 group-hover:opacity-100">
                                                <MoreVertical size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden space-y-4">
                {companies.map((company) => {
                    const { primary, color } = getStatusParts(company);
                    return (
                        <div
                            key={company.id}
                            onClick={() => router.push(`/company/${company.id}`)}
                            className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-[2rem] p-6 active:scale-[0.98] transition-all flex justify-between items-center group border-l-4 border-l-transparent active:border-l-blue-500 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className="hidden xs:flex w-11 h-11 rounded-full bg-gray-50 dark:bg-gray-900 items-center justify-center text-gray-400 font-black text-xs uppercase border border-gray-100 dark:border-gray-800 shadow-sm">
                                    {company.company_name.charAt(0)}
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-[6px] py-[2.5px] rounded-full text-[9px] font-black tracking-widest uppercase border ${color}`}>
                                            {primary}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-300 font-mono">
                                            {new Date(company.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 font-inter leading-none">
                                        {company.company_name}
                                    </h3>
                                    <div className="text-[10px] font-medium text-gray-400 font-mono tracking-tight lowercase opacity-70">
                                        {company.role_title.replace(/\s+/g, '-')}
                                    </div>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-gray-300 group-active:text-blue-500 transition-colors border border-transparent active:border-gray-100 dark:active:border-gray-800">
                                <MoreVertical size={16} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {companies.length === 0 && (
                <div className="px-6 py-16 text-center text-sm text-gray-500 italic bg-gray-50/50 dark:bg-gray-950 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                    No applications found. Add one to start tracking!
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title={`Delete ${deleteName}?`}
                message="This will permanently remove this application and all associated activity logs. This action cannot be undone."
            />
        </div>
    );
}
