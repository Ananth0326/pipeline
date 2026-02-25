'use client';

import { Company, ApplicationStatus } from '@/lib/types';
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

    const activeCount = companies.filter(c => !['rejected', 'offer'].includes(c.status)).length;
    const offerCount = companies.filter(c => c.status === 'offer').length;
    const rejectedCount = companies.filter(c => c.status === 'rejected').length;

    const getStatusParts = (company: Company) => {
        const statusMap: Record<ApplicationStatus, { primary: string, color: string }> = {
            applied: { primary: 'APPLIED', color: 'blue-600/20 text-blue-600 border-blue-200 bg-blue-50' },
            interview: { primary: 'INTERVIEW', color: 'yellow-600/20 text-yellow-600 border-yellow-200 bg-yellow-50' },
            rejected: { primary: 'REJECTED', color: 'red-600/20 text-red-600 border-red-200 bg-red-50' },
            offer: { primary: 'OFFER', color: 'green-600/20 text-green-600 border-green-200 bg-green-50' },
            selected: { primary: 'SELECTED', color: 'indigo-600/20 text-indigo-600 border-indigo-200 bg-indigo-50' },
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
                            <p className="text-sm font-black">{companies.length}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                            <CheckCircle2 size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Offers</p>
                            <p className="text-sm font-black">{offerCount}</p>
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
                        {companies.length} Apps • {activeCount} Pipelined • {offerCount} Offers • {rejectedCount} Rejected
                    </p>
                    <div className="flex-1 h-[1px] bg-gray-50 bg-gradient-to-r from-gray-100/50 to-transparent" />
                </div>
            </div>

            <div className="overflow-x-auto relative">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="sticky top-0 z-10 bg-white dark:bg-black">
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            <th className="px-4 md:px-6 py-4 text-left text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] font-sans">Project</th>
                            <th className="px-4 md:px-6 py-4 text-left text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] font-sans">Status</th>
                            <th className="hidden lg:table-cell px-6 py-4 text-left text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] font-sans">Compute</th>
                            <th className="hidden md:table-cell px-6 py-4 text-left text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] font-sans">Region</th>
                            <th className="hidden xl:table-cell px-6 py-4 text-left text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] font-sans">Created</th>
                            <th className="px-4 md:px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-950 bg-white dark:bg-black">
                        {companies.map((company) => {
                            const { primary, color } = getStatusParts(company);
                            return (
                                <tr
                                    key={company.id}
                                    onClick={() => router.push(`/company/${company.id}`)}
                                    className="hover:bg-gray-50/30 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group border-b border-gray-50 dark:border-gray-900"
                                >
                                    <td className="px-4 md:px-6 py-5 whitespace-nowrap">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-inter tracking-tight">
                                                {company.company_name}&apos;s Application
                                            </div>
                                            <div className="text-[11px] font-medium text-gray-400 font-mono tracking-tight lowercase opacity-70">
                                                {company.role_title.replace(/\s+/g, '-').toLowerCase()}-{company.id.slice(0, 8)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-5 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-tight border ${color}`}>
                                            {primary}
                                        </span>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-500 font-mono uppercase">
                                                {company.application_platform || 'NANO'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-5 whitespace-nowrap">
                                        <span className="text-xs font-medium text-gray-500 font-sans tracking-tight">
                                            {company.location || 'remote | global'}
                                        </span>
                                    </td>
                                    <td className="hidden xl:table-cell px-6 py-5 whitespace-nowrap text-xs font-medium text-gray-500 font-sans tracking-tight">
                                        {new Date(company.date_applied).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(',', '')} {new Date(company.date_applied).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </td>
                                    <td className="px-4 md:px-6 py-5 whitespace-nowrap text-right">
                                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="p-1 px-2 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-400 hover:text-black dark:hover:text-white">
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
