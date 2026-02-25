'use client';

import { Company, ApplicationStatus, AssessmentResponse } from '@/lib/types';
import { updateCompany } from '@/lib/actions';
import { useState } from 'react';

interface ProgressSectionProps {
    company: Company;
}

export default function ProgressSection({ company }: ProgressSectionProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (updates: Partial<Company>, logMessage: string) => {
        setIsUpdating(true);
        try {
            await updateCompany(company.id, updates, logMessage);
        } catch (error) {
            console.error('Failed to update:', error);
            alert('Update failed');
        } finally {
            setIsUpdating(false);
        }
    };

    if (company.status === 'rejected') {
        return (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-6 rounded-lg">
                <p className="text-red-800 dark:text-red-400 font-medium font-mono text-xs uppercase tracking-widest">Current Status: Rejected</p>
                <p className="text-red-900 dark:text-red-200 font-black text-2xl mt-1 tracking-tighter">Okay, keep going.</p>
                <button
                    onClick={() => handleUpdate({ status: 'applied' }, 'Reset to Applied')}
                    className="mt-6 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 hover:underline"
                >
                    ← Change Status Back to Applied
                </button>
            </div>
        );
    }

    if (company.status === 'offer') {
        return (
            <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-900/50 p-10 rounded-3xl space-y-6 text-center shadow-xl shadow-green-900/10">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl animate-bounce">
                    🏆
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-green-700 dark:text-green-500 mb-1">Status: Concluded</h3>
                    <p className="text-4xl font-black tracking-tighter text-green-950 dark:text-green-100 uppercase">Offer Received</p>
                </div>
                <p className="text-green-800 dark:text-green-400 font-medium italic">Congratulations! The hard work paid off.</p>
                <div className="pt-6">
                    <button
                        onClick={() => handleUpdate({ status: 'interview' }, 'Reset to Interview')}
                        className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400 hover:underline"
                    >
                        ← Back to Interviewing
                    </button>
                </div>
            </div>
        );
    }

    if (company.status === 'applied') {
        return (
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl space-y-6">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</h3>
                    <p className="text-xs font-black tracking-[0.2em] uppercase">Application Sent</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => handleUpdate({ status: 'interview' }, 'Move to Interviewing')}
                        className="bg-black text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/10"
                    >
                        Start Interviewing
                    </button>
                    <button
                        onClick={() => handleUpdate({ status: 'rejected' }, 'Marked Rejected')}
                        className="bg-white text-gray-400 border border-gray-100 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all font-bold"
                    >
                        Mark Rejected
                    </button>
                </div>
            </div>
        );
    }

    if (company.status === 'selected' || company.status === 'interview') {
        const isInterview = company.status === 'interview';
        return (
            <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl space-y-10 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-1">Stage: Interacting</h3>
                        <p className="text-xs font-black tracking-[0.2em] text-black dark:text-white uppercase">{company.status}</p>
                    </div>
                    <div className="flex gap-2">
                        {isInterview && (
                            <button
                                onClick={() => handleUpdate({ status: 'offer' }, 'Celebration: Offer Received!')}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-900/20"
                            >
                                Get Offer
                            </button>
                        )}
                        <button
                            onClick={() => handleUpdate({ status: 'rejected' }, 'Moved to Rejected')}
                            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 px-3 py-2 rounded-lg"
                        >
                            Mark Rejected
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-4 group cursor-pointer"
                        onClick={() => handleUpdate({ assessment_done: !company.assessment_done }, company.assessment_done ? 'Assessment Unchecked' : 'Assessment Done')}>
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${company.assessment_done ? 'bg-black dark:bg-white border-black dark:border-white' : 'bg-white border-gray-200 group-hover:border-black'
                            }`}>
                            {company.assessment_done && <span className="text-white dark:text-black text-xs font-black">✓</span>}
                        </div>
                        <span className="text-lg font-black text-black dark:text-white tracking-tighter">Assessment Done?</span>
                    </div>

                    {company.assessment_done && (
                        <div className="pl-10 space-y-8 border-l-2 border-green-100 dark:border-green-900/50">
                            <div>
                                <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-gray-400">Assessment Response</label>
                                <div className="flex gap-3">
                                    {(['response', 'no_response'] as AssessmentResponse[]).map((resp) => (
                                        <button
                                            key={resp}
                                            onClick={() => handleUpdate({ assessment_response: resp }, resp === 'response' ? 'Response Received' : 'No Response')}
                                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${company.assessment_response === resp
                                                ? 'bg-black text-white border-black dark:bg-white dark:text-black'
                                                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-900'
                                                }`}
                                        >
                                            {resp.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {company.assessment_response === 'response' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-left-2 transition-all">
                                    <div>
                                        <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-gray-400">Qualified?</label>
                                        <div className="flex gap-3">
                                            {[true, false].map((qual) => (
                                                <button
                                                    key={qual.toString()}
                                                    onClick={() => handleUpdate({ qualified: qual }, qual ? 'Qualified: Yes' : 'Qualified: No')}
                                                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${company.qualified === qual
                                                        ? (qual ? 'bg-black text-white border-black' : 'bg-red-600 text-white border-red-600')
                                                        : 'bg-white text-gray-400 border-gray-100 hover:border-black'
                                                        }`}
                                                >
                                                    {qual ? 'YES' : 'NO'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {company.qualified === true && (
                                        <div className="animate-in fade-in zoom-in-95">
                                            <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-gray-400">Interview Date</label>
                                            <input
                                                type="date"
                                                value={company.interview_date || ''}
                                                onChange={(e) => handleUpdate({ interview_date: e.target.value }, `Interview Scheduled: ${e.target.value}`)}
                                                className="border-2 border-gray-100 p-3 rounded-xl w-full max-w-sm focus:ring-4 focus:ring-gray-100 outline-none font-black text-black transition-all"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
}
