'use client';

import { Company, ApplicationStatus } from '@/lib/types';
import { FileText } from 'lucide-react';
import { useRef, useState } from 'react';
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
  const [showSubmitGif, setShowSubmitGif] = useState(false);
  const jdTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeFile(e.target.files?.[0] || null);
  };

  const applyInlineFormat = (delimiter: '**' | '*') => {
    const textarea = jdTextareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selectedText = formData.jd_text.slice(selectionStart, selectionEnd) || 'text';
    const updated =
      formData.jd_text.slice(0, selectionStart) +
      `${delimiter}${selectedText}${delimiter}` +
      formData.jd_text.slice(selectionEnd);
    setFormData((prev) => ({ ...prev, jd_text: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSubmitGif(true);
    try {
      await onSubmit(formData, resumeFile);
    } finally {
      setShowSubmitGif(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#78716C] border-b border-black/10 pb-2">Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Name" className="w-full rounded-xl border border-black/10 bg-[#F8F7F4] p-3 outline-none focus:ring-2 focus:ring-black/10" />
          <input required name="role_title" value={formData.role_title} onChange={handleChange} placeholder="Role Title" className="w-full rounded-xl border border-black/10 bg-[#F8F7F4] p-3 outline-none focus:ring-2 focus:ring-black/10" />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full rounded-xl border border-black/10 bg-[#F8F7F4] p-3 outline-none focus:ring-2 focus:ring-black/10" />
          <input name="application_platform" value={formData.application_platform} onChange={handleChange} placeholder="Application Platform" className="w-full rounded-xl border border-black/10 bg-[#F8F7F4] p-3 outline-none focus:ring-2 focus:ring-black/10" />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#78716C] border-b border-black/10 pb-2">Workflow</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" name="date_applied" value={formData.date_applied} onChange={handleChange} className="w-full rounded-xl border border-black/10 bg-[#F8F7F4] p-3 outline-none focus:ring-2 focus:ring-black/10" />
          <input name="status_text" value={formData.status_text} onChange={handleChange} placeholder="Status Text" className="w-full rounded-xl border border-black/10 bg-[#F8F7F4] p-3 outline-none focus:ring-2 focus:ring-black/10" />
        </div>
        <input name="next_action" value={formData.next_action} onChange={handleChange} placeholder="Next Action" className="w-full rounded-xl border border-black/10 bg-[#F8F7F4] p-3 outline-none focus:ring-2 focus:ring-black/10" />
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#78716C] border-b border-black/10 pb-2">Assets</h3>
        {initialData?.resume_url && !resumeFile ? (
          <div className="rounded-xl border border-black/10 bg-[#F8F7F4] p-3 text-sm text-[#78716C] inline-flex items-center gap-2">
            <FileText size={16} />
            Existing resume linked
          </div>
        ) : null}
        <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full text-sm text-[#78716C] file:mr-4 file:rounded-lg file:border file:border-black/10 file:bg-white file:px-4 file:py-2 file:text-[#1C1917]" />
        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Internal Notes" className="w-full rounded-xl border border-black/10 bg-[#F8F7F4] p-3 outline-none focus:ring-2 focus:ring-black/10" />
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => applyInlineFormat('**')} className="subtle-control rounded-md px-2 py-1 text-[10px] font-black uppercase">Bold</button>
          <button type="button" onClick={() => applyInlineFormat('*')} className="subtle-control rounded-md px-2 py-1 text-[10px] font-black uppercase italic">Italic</button>
        </div>
        <textarea ref={jdTextareaRef} name="jd_text" value={formData.jd_text} onChange={handleChange} rows={7} placeholder="Job Description" className="w-full rounded-xl border border-black/10 bg-[#F8F7F4] p-3 outline-none focus:ring-2 focus:ring-black/10" />
      </section>

      <button type="submit" disabled={isSubmitting || showSubmitGif} className="w-full rounded-xl bg-[#1C1917] px-8 py-4 text-sm font-black uppercase tracking-[0.14em] text-white hover:bg-black disabled:bg-gray-500">
        {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Application' : 'Add Application'}
      </button>

      <AnalystLoader isOpen={showSubmitGif} />
    </form>
  );
}
