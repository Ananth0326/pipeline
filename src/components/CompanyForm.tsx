'use client';

import { Company, ApplicationStatus } from '@/lib/types';
import { useRef, useState } from 'react';
import { FileText, Globe, Target } from 'lucide-react';
import AnalystLoader from './AnalystLoader';

interface CompanyFormProps {
    initialData?: Partial<Company>;
    onSubmit: (data: any, resumeFile: File | null) => Promise<void>;
    isSubmitting: boolean;
}

export default function CompanyForm({ initialData, onSubmit, isSubmitting }: CompanyFormProps) {
    const [formData, setFormData] = useState({
        company_name: initialData?.company_name || '',
        role_title: initialData?.role_title || '',
        location: initialData?.location || '',
        jd_text: initialData?.jd_text || '',
        date_applied: initialData?.date_applied || new Date().toISOString().split('T')[0],
        status: (initialData?.status as ApplicationStatus) || 'applied',
        status_text: initialData?.status_text || 'Applied',
        status_color: initialData?.status_color || 'yellow',
        notes: initialData?.notes || '',
        application_platform: initialData?.application_platform || '',
        next_action: initialData?.next_action || '',
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const jdTextareaRef = useRef<HTMLTextAreaElement>(null);

    // AI Autofill States
    const [autofillUrl, setAutofillUrl] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractError, setExtractError] = useState('');
    const [extractSuccess, setExtractSuccess] = useState(false);
    const [showSubmitGif, setShowSubmitGif] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResumeFile(e.target.files?.[0] || null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setShowSubmitGif(true);
        const minimumLoaderTime = new Promise<void>((resolve) => {
            setTimeout(resolve, 3000);
        });

        try {
            await Promise.all([onSubmit(formData, resumeFile), minimumLoaderTime]);
        } finally {
            setShowSubmitGif(false);
        }
    };

    const applyInlineFormat = (delimiter: '**' | '*') => {
        const textarea = jdTextareaRef.current;
        if (!textarea) return;

        const { selectionStart, selectionEnd } = textarea;
        const selectedText = formData.jd_text.slice(selectionStart, selectionEnd);
        const content = selectedText || 'text';
        const updated =
            formData.jd_text.slice(0, selectionStart) +
            `${delimiter}${content}${delimiter}` +
            formData.jd_text.slice(selectionEnd);

        setFormData(prev => ({ ...prev, jd_text: updated }));

        const selectionOffset = delimiter.length;
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(
                selectionStart + selectionOffset,
                selectionStart + selectionOffset + content.length
            );
        });
    };

    const applyBullets = () => {
        const textarea = jdTextareaRef.current;
        if (!textarea) return;

        const { selectionStart, selectionEnd } = textarea;
        const selectedText = formData.jd_text.slice(selectionStart, selectionEnd);

        if (!selectedText) {
            const updated =
                formData.jd_text.slice(0, selectionStart) +
                '- ' +
                formData.jd_text.slice(selectionEnd);
            setFormData(prev => ({ ...prev, jd_text: updated }));

            requestAnimationFrame(() => {
                textarea.focus();
                textarea.setSelectionRange(selectionStart + 2, selectionStart + 2);
            });
            return;
        }

        const bulletedText = selectedText
            .split('\n')
            .map((line) => (line.trim() ? (line.trimStart().startsWith('- ') ? line : `- ${line}`) : line))
            .join('\n');

        const updated =
            formData.jd_text.slice(0, selectionStart) +
            bulletedText +
            formData.jd_text.slice(selectionEnd);

        setFormData(prev => ({ ...prev, jd_text: updated }));

        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(selectionStart, selectionStart + bulletedText.length);
        });
    };

    const handleAutofill = async () => {
        if (!autofillUrl.trim()) return;
        setIsExtracting(true);
        setExtractError('');
        setExtractSuccess(false);

        try {
            const res = await fetch('/api/extract-job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: autofillUrl })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Failed to extract data.');
            if (data.data) {
                setFormData(prev => ({
                    ...prev,
                    company_name: data.data.company_name || prev.company_name,
                    role_title: data.data.role_title || prev.role_title,
                    location: data.data.location || prev.location,
                    jd_text: data.data.jd_text || prev.jd_text,
                    application_platform: autofillUrl
                }));
                setExtractSuccess(true);
                setTimeout(() => setExtractSuccess(false), 3000);
            }
        } catch (error: any) {
            setExtractError(error.message);
        } finally {
            setIsExtracting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12 max-w-2xl">
            {/* SECTION 1: CORE INFO */}
            <div className="space-y-6 md:space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E1E1E1]/60 border-b border-white/10 pb-2">Identification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mb-2">Company Name *</label>
                        <input
                            required
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            className="w-full border border-white/10 bg-[#0A0A0A] p-3 rounded-xl focus:ring-2 focus:ring-[#00F2FE]/30 focus:border-[#00F2FE]/40 outline-none font-bold transition-all"
                            placeholder="Alphabet Inc."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mb-2">Role Title *</label>
                        <input
                            required
                            name="role_title"
                            value={formData.role_title}
                            onChange={handleChange}
                            className="w-full border border-white/10 bg-[#0A0A0A] p-3 rounded-xl focus:ring-2 focus:ring-[#00F2FE]/30 focus:border-[#00F2FE]/40 outline-none font-bold transition-all"
                            placeholder="Software Engineer"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mb-2">Location</label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full border border-white/10 bg-[#0A0A0A] p-3 rounded-xl focus:ring-2 focus:ring-white/20 outline-none font-bold transition-all"
                            placeholder="Remote / New York"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mb-2">Application Platform</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-3.5 text-[#E1E1E1]/40" size={16} />
                            <input
                                name="application_platform"
                                value={formData.application_platform}
                                onChange={handleChange}
                                className="w-full border border-white/10 bg-[#0A0A0A] pl-10 p-3 rounded-xl focus:ring-2 focus:ring-white/20 outline-none font-bold transition-all"
                                placeholder="LinkedIn, Company Portal, etc."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: WORKFLOW */}
            <div className="space-y-6 md:space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E1E1E1]/60 border-b border-white/10 pb-2">Intelligence</h3>
                <div className="p-4 md:p-8 bg-[#161616] border border-white/10 rounded-3xl space-y-8 backdrop-blur-md">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mb-3">
                            <Target size={14} className="text-black" /> Next Action
                        </label>
                        <input
                            name="next_action"
                            value={formData.next_action}
                            onChange={handleChange}
                            className="w-full border border-white/10 bg-[#0A0A0A] p-3 rounded-xl focus:ring-2 focus:ring-[#00F2FE]/30 outline-none font-black uppercase tracking-tighter text-[#E1E1E1] placeholder:text-[#E1E1E1]/30 transition-all"
                            placeholder="Auto-suggested based on status..."
                        />
                        <p className="text-[9px] text-[#E1E1E1]/60 mt-2 font-medium italic px-1">Leave empty to use the internal predictor.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mb-2">Applied Date</label>
                            <input
                                type="date"
                                name="date_applied"
                                value={formData.date_applied}
                                onChange={handleChange}
                                className="w-full border border-white/10 bg-[#0A0A0A] p-3 rounded-xl focus:ring-2 focus:ring-white/20 outline-none font-bold transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mb-2">Manual Status</label>
                            <div className="flex flex-col gap-3">
                                <input
                                    name="status_text"
                                    value={formData.status_text}
                                    onChange={handleChange}
                                    className="w-full border border-white/10 bg-[#0A0A0A] p-3 rounded-xl focus:ring-2 focus:ring-white/20 outline-none font-black uppercase tracking-widest text-[10px] placeholder:text-[#E1E1E1]/30 transition-all"
                                    placeholder="e.g. READY FOR INTERVIEW"
                                />
                                <div className="flex gap-2">
                                    {(['green', 'yellow', 'red'] as const).map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, status_color: color }))}
                                            className={`w-8 h-8 rounded-full border transition-all ${formData.status_color === color
                                                ? 'border-white scale-110 shadow-md'
                                                : 'border-white/20 opacity-60 hover:opacity-100'
                                                } ${color === 'green' ? 'bg-[#00E676]' :
                                                    color === 'yellow' ? 'bg-[#00F2FE]' : 'bg-[#FF1744]'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: ASSETS */}
            <div className="space-y-6 md:space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E1E1E1]/60 border-b border-white/10 pb-2">Assets</h3>
                <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60">Resume File (PDF)</label>
                    {initialData?.resume_url && !resumeFile && (
                        <div className="flex items-center gap-3 p-4 bg-[#00F2FE]/10 rounded-xl border border-[#00F2FE]/30">
                            <FileText size={20} className="text-[#00F2FE]" />
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-[#00F2FE] uppercase">Current Resume</p>
                                <p className="text-xs font-medium text-[#E1E1E1]/70 truncate max-w-[200px]">Existing file linked</p>
                            </div>
                            <span className="text-[10px] font-bold text-[#E1E1E1]/60 italic">Upload new to replace</span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full text-sm text-[#E1E1E1]/70 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border file:border-white/10 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-black file:text-[#E1E1E1] hover:file:bg-[#111111] transition-all cursor-pointer"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mb-2">Internal Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-white/10 bg-[#0A0A0A] p-4 rounded-2xl focus:ring-2 focus:ring-white/20 outline-none font-medium italic text-sm transition-all"
                        placeholder="Referrals, HR names, follow-up dates..."
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60">Job Description</label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => applyInlineFormat('**')}
                                className="px-2 py-1 rounded-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/70 hover:bg-white/10"
                            >
                                Bold
                            </button>
                            <button
                                type="button"
                                onClick={() => applyInlineFormat('*')}
                                className="px-2 py-1 rounded-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/70 hover:bg-white/10 italic"
                            >
                                Italic
                            </button>
                            <button
                                type="button"
                                onClick={applyBullets}
                                className="px-2 py-1 rounded-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/70 hover:bg-white/10"
                            >
                                Bullets
                            </button>
                        </div>
                    </div>
                    <textarea
                        ref={jdTextareaRef}
                        name="jd_text"
                        value={formData.jd_text}
                        onChange={handleChange}
                        rows={6}
                        className="w-full border border-white/10 bg-[#0A0A0A] p-4 rounded-2xl focus:ring-2 focus:ring-white/20 outline-none font-medium text-sm leading-relaxed transition-all"
                        placeholder="Paste JD details here... (supports bold, italic, bullets)"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || showSubmitGif}
                className="w-full bg-black text-[#E1E1E1] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#111111] active:scale-95 disabled:bg-gray-700 transition-all shadow-xl shadow-emerald-500/50 border border-white/10"
            >
                {isSubmitting ? 'Syncing...' : initialData?.id ? 'Update Information' : 'Deploy Application'}
            </button>

            <AnalystLoader isOpen={showSubmitGif} />
        </form>
    );
}
