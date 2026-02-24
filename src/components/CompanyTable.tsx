'use client';

import { Company } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { deleteCompany } from '@/lib/actions';
import { Trash2, ExternalLink, Target, PieChart, Users, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

interface CompanyTableProps {
    companies: Company[];
}

export default function CompanyTable({ companies }: CompanyTableProps) {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteName, setDeleteName] = useState('');

    const activeCount = companies.filter(c => c.status !== 'rejected').length;
    const selectedCount = companies.filter(c => c.status === 'selected').length;
    const rejectedCount = companies.filter(c => c.status === 'rejected').length;

    const getStatusParts = (company: Company) => {
        if (company.status === 'rejected') return { primary: 'REJECTED', secondary: '', color: 'bg-red-50 text-red-600' };

        let secondary = '';
        if (company.status === 'selected') {
            if (company.interview_date) secondary = 'Interview Scheduled';
            else if (company.qualified === true) secondary = 'Qualified';
            else if (company.assessment_done) secondary = 'Assessment Done';
        }

        const color = company.status === 'selected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
        return { primary: company.status.toUpperCase(), secondary, color };
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
                            <p className="text-sm font-black">{companies.length}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                            <CheckCircle2 size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Active</p>
                            <p className="text-sm font-black">{activeCount}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                            <PieChart size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Rejected</p>
                            <p className="text-sm font-black">{rejectedCount}</p>
                        </div>
                    </div>
                </div>

                {/* SUMMARY LINE */}
                <div className="flex items-center gap-2 px-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                        {companies.length} Applications • {activeCount} Active • {rejectedCount} Rejected
                    </p>
                    <div className="flex-1 h-[1px] bg-gray-50 bg-gradient-to-r from-gray-100/50 to-transparent" />
                </div>
            </div>

            <div className="overflow-x-auto relative">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md">
                        <tr className="border-b border-gray-50 dark:border-gray-900">
                            <th className="px-4 md:px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Company & Role</th>
                            <th className="px-4 md:px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="hidden lg:table-cell px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Action</th>
                            <th className="hidden md:table-cell px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied</th>
                            <th className="hidden xl:table-cell px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Activity</th>
                            <th className="px-4 md:px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-900 bg-white dark:bg-black">
                        {companies.map((company) => {
                            const { primary, secondary, color } = getStatusParts(company);
                            return (
                                <tr
                                    key={company.id}
                                    onClick={() => router.push(`/company/${company.id}`)}
                                    className="hover:bg-gray-50/50 dark:hover:bg-gray-950 transition-colors cursor-pointer group"
                                >
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <div className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                                                {company.company_name}
                                            </div>
                                            <div className="text-[9px] font-bold text-gray-400 group-hover:text-gray-500 transition-colors uppercase tracking-tight">
                                                {company.role_title}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                            <span className={`w-fit px-2 py-0.5 rounded text-[9px] font-black tracking-tighter ${color}`}>
                                                {primary}
                                            </span>
                                            {secondary && (
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight truncate max-w-[80px] md:max-w-none">
                                                    {secondary}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                                        {company.next_action ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-black dark:bg-white animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-tight text-black dark:text-white">
                                                    {company.next_action}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[9px] text-gray-300 italic font-medium">No action needed</span>
                                        )}
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                        {new Date(company.date_applied).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                                        {new Date(company.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex justify-end items-center gap-4 md:gap-6 md:opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteId(company.id);
                                                    setDeleteName(company.company_name);
                                                }}
                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="text-gray-200">
                                                <ExternalLink size={14} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {companies.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-500 italic">
                                    No applications found. Add one to start tracking!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
