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
    const [error, setError] = useState('');

    const handleUpdate = async (updates: Partial<Company>, logMessage: string) => {
        setError('');
        setIsUpdating(true);
        try {
            const res = await updateCompany(company.id, updates, logMessage);
            if (res?.error) setError(res.error);
        } catch (err) {
            console.error('Failed to update:', err);
            setError(err instanceof Error ? err.message : 'Update failed');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleManualUpdate = () => {
        handleUpdate({ status_text: statusText, status_color: statusColor }, `Status Changed: ${statusText}`);
    };

    return (
        <div className="bg-[#161616] border border-white/10 p-8 rounded-3xl space-y-8 backdrop-blur-md">
            {error && (
                <div className="rounded-xl border border-red-900/50 bg-red-900/20 p-4 text-red-200">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-400">Error</p>
                    <p className="mt-1 text-sm">{error}</p>
                </div>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex-1 space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00F2FE]">Current Manual Status</h3>
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${statusColor === 'green' ? 'bg-[#00E676]' :
                            statusColor === 'yellow' ? 'bg-[#00F2FE]' : 'bg-[#FF1744]'
                            }`} />
                        <p className="text-xl font-black tracking-tight text-[#E1E1E1] uppercase">{statusText}</p>
                    </div>
                </div>
                {isUpdating && (
                    <div className="text-[10px] font-black text-[#00F2FE] animate-pulse uppercase tracking-widest">
                        Syncing...
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-t border-white/10 pt-8">
                <div className="md:col-span-7">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mb-2">Update Text</label>
                    <input
                        value={statusText}
                        onChange={(e) => setStatusText(e.target.value)}
                        className="w-full border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-[#00F2FE]/30 outline-none font-bold text-sm bg-[#0A0A0A] transition-all"
                        placeholder="e.g. Assessment Received..."
                    />
                </div>
                <div className="md:col-span-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mb-2">Color</label>
                    <div className="flex gap-3 h-[46px] items-center bg-[#0A0A0A] rounded-xl px-4 border border-white/10">
                        {(['green', 'yellow', 'red'] as const).map((color) => (
                            <button
                                key={color}
                                onClick={() => setStatusColor(color)}
                                className={`w-6 h-6 rounded-full transition-all ${statusColor === color ? 'scale-125 ring-2 ring-offset-2 ring-white/40 ring-offset-[#0A0A0A]' : 'opacity-50 hover:opacity-100'
                                    } ${color === 'green' ? 'bg-[#00E676]' :
                                        color === 'yellow' ? 'bg-[#00F2FE]' : 'bg-[#FF1744]'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <button
                        onClick={handleManualUpdate}
                        disabled={isUpdating || (statusText === company.status_text && statusColor === company.status_color)}
                        className="w-full h-[46px] bg-black text-[#E1E1E1] font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-[#111111] border border-white/10 shadow-lg shadow-emerald-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        Save
                    </button>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    onClick={() => handleUpdate({ status_color: 'red', status_text: 'Marked Rejected' }, 'Quick Reject')}
                    className="text-[10px] font-black uppercase tracking-widest text-[#FF1744] hover:text-[#ff4d6d] transition-colors"
                >
                    Quick Reject
                </button>
                <div className="w-[1px] h-3 bg-white/10" />
                <button
                    onClick={() => handleUpdate({ status_color: 'green', status_text: 'Offer Received' }, 'Quick Offer')}
                    className="text-[10px] font-black uppercase tracking-widest text-[#00E676] hover:text-[#3dff9d] transition-colors"
                >
                    Quick Offer
                </button>
            </div>
        </div>
    );
}
