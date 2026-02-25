'use client';

import { Company, ApplicationStatus, AssessmentResponse } from '@/lib/types';
import { updateCompany } from '@/lib/actions';
import { useState } from 'react';

interface ProgressSectionProps {
    company: Company;
}

export default function ProgressSection({ company }: ProgressSectionProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [statusText, setStatusText] = useState(company.status_text || 'Applied');
    const [statusColor, setStatusColor] = useState(company.status_color || 'yellow');

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

    const handleManualUpdate = () => {
        handleUpdate({ status_text: statusText, status_color: statusColor }, `Status Changed: ${statusText}`);
    };

    return (
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl space-y-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex-1 space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Current Manual Status</h3>
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${statusColor === 'green' ? 'bg-green-500' :
                            statusColor === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'
                            }`} />
                        <p className="text-xl font-black tracking-tight text-gray-900 dark:text-gray-100 uppercase">{statusText}</p>
                    </div>
                </div>
                {isUpdating && (
                    <div className="text-[10px] font-black text-blue-500 animate-pulse uppercase tracking-widest">
                        Syncing...
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-t border-gray-50 dark:border-gray-900 pt-8">
                <div className="md:col-span-7">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Update Text</label>
                    <input
                        value={statusText}
                        onChange={(e) => setStatusText(e.target.value)}
                        className="w-full border-2 border-gray-50 dark:border-gray-900 p-3 rounded-xl focus:ring-4 focus:ring-blue-50 outline-none font-bold text-sm bg-gray-50/50 dark:bg-gray-900/50 transition-all"
                        placeholder="e.g. Assessment Received..."
                    />
                </div>
                <div className="md:col-span-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Color</label>
                    <div className="flex gap-3 h-[46px] items-center bg-gray-50/50 dark:bg-gray-900/50 rounded-xl px-4 border-2 border-gray-50 dark:border-gray-900">
                        {(['green', 'yellow', 'red'] as const).map((color) => (
                            <button
                                key={color}
                                onClick={() => setStatusColor(color)}
                                className={`w-6 h-6 rounded-full transition-all ${statusColor === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-200 dark:ring-gray-700' : 'opacity-40 hover:opacity-100'
                                    } ${color === 'green' ? 'bg-green-500' :
                                        color === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <button
                        onClick={handleManualUpdate}
                        disabled={isUpdating || (statusText === company.status_text && statusColor === company.status_color)}
                        className="w-full h-[46px] bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        Save
                    </button>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    onClick={() => handleUpdate({ status_color: 'red', status_text: 'Marked Rejected' }, 'Quick Reject')}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                >
                    Quick Reject
                </button>
                <div className="w-[1px] h-3 bg-gray-100 dark:bg-gray-800" />
                <button
                    onClick={() => handleUpdate({ status_color: 'green', status_text: 'Offer Received' }, 'Quick Offer')}
                    className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 transition-colors"
                >
                    Quick Offer
                </button>
            </div>
        </div>
    );
}
