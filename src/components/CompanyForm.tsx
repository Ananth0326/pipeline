'use client';

import { Company, ApplicationStatus } from '@/lib/types';
import { useRef, useState } from 'react';
import { FileText, Globe, Target } from 'lucide-react';

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
        application_links: initialData?.application_links || '',
        next_action: initialData?.next_action || '',
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const jdTextareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResumeFile(e.target.files?.[0] || null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, resumeFile);
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

    return (
        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12 max-w-2xl">
            {/* SECTION 1: CORE INFO */}
            <div className="space-y-6 md:space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2">Identification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Company Name *</label>
                        <input
                            required
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-100 p-3 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none font-bold transition-all"
                            placeholder="Alphabet Inc."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Role Title *</label>
                        <input
                            required
                            name="role_title"
                            value={formData.role_title}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-100 p-3 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none font-bold transition-all"
                            placeholder="Software Engineer"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Location</label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-100 p-3 rounded-xl focus:ring-4 focus:ring-gray-50 outline-none font-bold transition-all"
                            placeholder="Remote / New York"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Application Platform</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-3.5 text-gray-300" size={16} />
                            <input
                                name="application_platform"
                                value={formData.application_platform}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-100 pl-10 p-3 rounded-xl focus:ring-4 focus:ring-gray-50 outline-none font-bold transition-all"
                                placeholder="LinkedIn, Company Portal, etc."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: WORKFLOW */}
            <div className="space-y-6 md:space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2">Intelligence</h3>
                <div className="p-4 md:p-8 bg-gray-50/50 border border-gray-100 rounded-3xl space-y-8">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                            <Target size={14} className="text-black" /> Next Action
                        </label>
                        <input
                            name="next_action"
                            value={formData.next_action}
                            onChange={handleChange}
                            className="w-full border-2 border-white p-3 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-black uppercase tracking-tighter text-blue-900 placeholder:text-gray-300 transition-all shadow-sm"
                            placeholder="Auto-suggested based on status..."
                        />
                        <p className="text-[9px] text-gray-400 mt-2 font-medium italic px-1">Leave empty to use the internal predictor.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Applied Date</label>
                            <input
                                type="date"
                                name="date_applied"
                                value={formData.date_applied}
                                onChange={handleChange}
                                className="w-full border-2 border-white p-3 rounded-xl focus:ring-4 focus:ring-gray-50 outline-none font-bold transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Manual Status</label>
                            <div className="flex flex-col gap-3">
                                <input
                                    name="status_text"
                                    value={formData.status_text}
                                    onChange={handleChange}
                                    className="w-full border-2 border-white p-3 rounded-xl focus:ring-4 focus:ring-gray-50 outline-none font-black uppercase tracking-widest text-[10px] placeholder:text-gray-300 transition-all shadow-sm"
                                    placeholder="e.g. READY FOR INTERVIEW"
                                />
                                <div className="flex gap-2">
                                    {(['green', 'yellow', 'red'] as const).map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, status_color: color }))}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${formData.status_color === color
                                                ? 'border-black scale-110 shadow-md'
                                                : 'border-transparent opacity-50 hover:opacity-100'
                                                } ${color === 'green' ? 'bg-green-500' :
                                                    color === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'
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
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2">Assets</h3>
                <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Resume File (PDF)</label>
                    {initialData?.resume_url && !resumeFile && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                            <FileText size={20} className="text-blue-600" />
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-blue-900 uppercase">Current Resume</p>
                                <p className="text-xs font-medium text-blue-700 truncate max-w-[200px]">Existing file linked</p>
                            </div>
                            <span className="text-[10px] font-bold text-blue-400 italic">Upload new to replace</span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-black file:text-white hover:file:bg-gray-800 transition-all cursor-pointer"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Internal Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:ring-4 focus:ring-gray-50 outline-none font-medium italic text-sm transition-all"
                        placeholder="Referrals, HR names, follow-up dates..."
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Application Links</label>
                    <textarea
                        name="application_links"
                        value={formData.application_links}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:ring-4 focus:ring-gray-50 outline-none font-medium text-sm transition-all"
                        placeholder={"https://careers.company.com/job/123\nhttps://linkedin.com/jobs/view/456"}
                    />
                    <p className="text-[9px] text-gray-400 mt-2 font-medium italic px-1">One link per line.</p>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Job Description</label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => applyInlineFormat('**')}
                                className="px-2 py-1 rounded-md border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100"
                            >
                                Bold
                            </button>
                            <button
                                type="button"
                                onClick={() => applyInlineFormat('*')}
                                className="px-2 py-1 rounded-md border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 italic"
                            >
                                Italic
                            </button>
                            <button
                                type="button"
                                onClick={applyBullets}
                                className="px-2 py-1 rounded-md border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100"
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
                        className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:ring-4 focus:ring-gray-50 outline-none font-medium text-sm leading-relaxed transition-all"
                        placeholder="Paste JD details here... (supports bold, italic, bullets)"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-800 disabled:bg-gray-400 transition-all shadow-xl shadow-gray-900/10 border-b-4 border-gray-900 active:border-b-0 active:translate-y-1"
            >
                {isSubmitting ? 'Syncing...' : initialData?.id ? 'Update Information' : 'Deploy Application'}
            </button>
        </form>
    );
}
