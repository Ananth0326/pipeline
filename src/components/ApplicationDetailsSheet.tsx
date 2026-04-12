'use client';

import { Company, AppLog } from '@/lib/types';
import { X, FileText } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ActivityTimeline from './ActivityTimeline';
import FormattedText from './FormattedText';

type CompanyDetail = Company & { application_logs: AppLog[] };

interface ApplicationDetailsSheetProps {
  isOpen: boolean;
  isLoading: boolean;
  company: CompanyDetail | null;
  onClose: () => void;
}

export default function ApplicationDetailsSheet({
  isOpen,
  isLoading,
  company,
  onClose,
}: ApplicationDetailsSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
            onClick={onClose}
            aria-label="Close details"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="absolute right-0 top-0 h-full w-full max-w-2xl border-l border-black/10 bg-[#FDFCFB] p-6 md:p-8 shadow-[-24px_0_60px_rgba(0,0,0,0.08)]"
          >
            <div className="modal-grain" />
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-black/10 pb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#78716C]">Application Details</p>
                <h2 className="mt-2 text-2xl font-black text-[#1C1917]">{company?.company_name || 'Loading...'}</h2>
                <p className="text-sm text-[#78716C]">{company?.role_title || ''}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="subtle-control rounded-lg p-2"
              >
                <X size={18} />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200" />
                <div className="h-24 animate-pulse rounded-xl bg-stone-100" />
                <div className="h-24 animate-pulse rounded-xl bg-stone-100" />
              </div>
            ) : company ? (
              <div className="space-y-6 overflow-y-auto pr-1 minimal-scrollbar" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                <section className="premium-card p-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-[#78716C]">Job Description</h3>
                  <div className="mt-3 text-sm text-[#1C1917]">
                    {company.jd_text ? <FormattedText text={company.jd_text} /> : <p className="text-[#78716C]">No JD saved yet.</p>}
                  </div>
                </section>

                <section className="premium-card p-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-[#78716C]">Resume</h3>
                  {company.resume_url ? (
                    <a
                      href={company.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="subtle-control mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
                    >
                      <FileText size={15} />
                      Preview Resume
                    </a>
                  ) : (
                    <p className="mt-2 text-sm text-[#78716C]">No resume linked yet.</p>
                  )}
                </section>

                <section className="premium-card p-4">
                  <ActivityTimeline logs={company.application_logs || []} />
                </section>
              </div>
            ) : (
              <p className="text-sm text-[#78716C]">No details available.</p>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
