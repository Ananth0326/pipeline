'use client';

import { Company } from '@/lib/types';
import { deleteCompany, getCompany, updateCompany } from '@/lib/actions';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, LayoutList, MoreVertical, X } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import KanbanBoard from './KanbanBoard';
import ApplicationDetailsSheet from './ApplicationDetailsSheet';
import CompanyForm from './CompanyForm';

type ViewMode = 'kanban' | 'list';

interface CompanyTableProps {
  companies: Company[];
}

export default function CompanyTable({ companies }: CompanyTableProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [menuId, setMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsData, setDetailsData] = useState<any | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const stats = useMemo(() => {
    const active = companies.filter((c) => c.status !== 'rejected').length;
    const interviews = companies.filter((c) => c.status === 'interview' || c.status === 'selected').length;
    const offers = companies.filter((c) => c.status === 'offer').length;
    return { total: companies.length, active, interviews, offers };
  }, [companies]);

  const openDetails = async (id: string) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    try {
      const detail = await getCompany(id);
      setDetailsData(detail);
    } catch (error) {
      console.error('Failed to load details:', error);
      setDetailsData(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const archiveCompany = async (company: Company) => {
    await updateCompany(
      company.id,
      {
        status: 'rejected',
        status_text: 'Archived',
        status_color: 'red',
      },
      'Archived from dashboard'
    );
  };

  const handleEditSubmit = async (formData: any, resumeFile: File | null) => {
    if (!editingCompany) return;
    setIsSubmittingEdit(true);
    try {
      let resumeData;
      if (resumeFile) {
        resumeData = {
          name: resumeFile.name,
          type: resumeFile.type,
          buffer: await resumeFile.arrayBuffer(),
        };
      }
      await updateCompany(editingCompany.id, formData, 'Updated from dashboard modal', resumeData);
      setEditingCompany(null);
    } catch (error) {
      console.error('Failed to update company:', error);
      alert('Failed to update application.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="premium-card p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#78716C]">Total Apps</p>
          <p className="mt-1 text-2xl font-black text-[#1C1917]">{stats.total}</p>
        </div>
        <div className="premium-card p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#78716C]">Active Pipelines</p>
          <p className="mt-1 text-2xl font-black text-[#1C1917]">{stats.active}</p>
        </div>
        <div className="premium-card p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#78716C]">Interviews</p>
          <p className="mt-1 text-2xl font-black text-[#1C1917]">{stats.interviews}</p>
        </div>
        <div className="premium-card p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#78716C]">Offers</p>
          <p className="mt-1 text-2xl font-black text-[#1C1917]">{stats.offers}</p>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#78716C]">Application Views</p>
        <div className="premium-card inline-flex p-1">
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${viewMode === 'kanban' ? 'bg-[#1C1917] text-white' : 'text-[#1C1917]'}`}
          >
            <LayoutGrid size={13} /> Kanban
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${viewMode === 'list' ? 'bg-[#1C1917] text-white' : 'text-[#1C1917]'}`}
          >
            <LayoutList size={13} /> Condensed List
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'kanban' ? (
          <motion.div key="kanban" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.14 }}>
            <KanbanBoard
              companies={companies}
              onOpenDetails={openDetails}
              onEdit={(company) => setEditingCompany(company)}
              onArchive={archiveCompany}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.14 }} className="space-y-3">
            <div className="grid grid-cols-[2fr_1fr_1fr_1.3fr_auto] gap-3 px-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#78716C]">
              <span>Company / Role</span>
              <span>Status</span>
              <span>Date Applied</span>
              <span>Next Action</span>
              <span className="text-right">Quick Actions</span>
            </div>

            {companies.map((company) => (
              <div key={company.id} className="premium-card grid grid-cols-[2fr_1fr_1fr_1.3fr_auto] items-center gap-3 p-4 transition-all duration-150 hover:-translate-y-px hover:shadow-[0_12px_20px_rgba(0,0,0,0.05)]">
                <div>
                  <p className="font-bold text-[#1C1917]">{company.company_name}</p>
                  <p className="text-xs text-[#78716C]">{company.role_title}</p>
                </div>
                <span className="inline-flex w-fit rounded-full border border-black/10 bg-stone-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#475569]">
                  {(company.status_text || company.status).toString()}
                </span>
                <p className="text-xs text-[#78716C]">{new Date(company.date_applied).toLocaleDateString()}</p>
                <p className="truncate text-xs text-[#1C1917]">{company.next_action || 'No action set'}</p>
                <div className="relative justify-self-end">
                  <button
                    type="button"
                    onClick={() => setMenuId((prev) => (prev === company.id ? null : company.id))}
                    className="subtle-control rounded-lg p-2"
                  >
                    <MoreVertical size={14} />
                  </button>
                  {menuId === company.id ? (
                    <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-black/10 bg-white/95 p-1 backdrop-blur-md shadow-[0_10px_18px_rgba(0,0,0,0.08)]">
                      <button type="button" onClick={() => { setMenuId(null); openDetails(company.id); }} className="subtle-control w-full rounded-md px-3 py-2 text-left text-xs font-semibold">Details</button>
                      <button type="button" onClick={() => { setMenuId(null); setEditingCompany(company); }} className="subtle-control mt-1 w-full rounded-md px-3 py-2 text-left text-xs font-semibold">Edit</button>
                      <button type="button" onClick={() => { setMenuId(null); archiveCompany(company); }} className="subtle-control mt-1 w-full rounded-md px-3 py-2 text-left text-xs font-semibold">Archive</button>
                      <button type="button" onClick={() => { setMenuId(null); setDeleteTarget(company); }} className="mt-1 w-full rounded-md border border-red-200 bg-red-50 px-3 py-2 text-left text-xs font-semibold text-red-700">Delete</button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {companies.length === 0 ? (
              <div className="premium-card p-8 text-center">
                <p className="text-base font-semibold text-[#1C1917]">No applications yet</p>
                <p className="mt-2 text-sm text-[#78716C]">Use Add Application to start your pipeline.</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      <ApplicationDetailsSheet
        isOpen={detailsOpen}
        isLoading={detailsLoading}
        company={detailsData}
        onClose={() => {
          setDetailsOpen(false);
          setDetailsData(null);
        }}
      />

      <AnimatePresence>
        {editingCompany ? (
          <div className="fixed inset-0 z-[110] flex items-end justify-center md:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20"
              onClick={() => !isSubmittingEdit && setEditingCompany(null)}
            />
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              className="premium-card relative z-[111] max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#FDFCFB] p-6 md:p-8"
            >
              <div className="modal-grain" />
              <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#78716C]">Edit Application</p>
                  <h3 className="mt-1 text-xl font-black text-[#1C1917]">{editingCompany.company_name}</h3>
                </div>
                <button type="button" onClick={() => setEditingCompany(null)} className="subtle-control rounded-lg p-2">
                  <X size={18} />
                </button>
              </div>
              <CompanyForm initialData={editingCompany} onSubmit={handleEditSubmit} isSubmitting={isSubmittingEdit} />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteCompany(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title={deleteTarget ? `Delete ${deleteTarget.company_name}?` : 'Delete application?'}
        message="This will permanently delete this application and its activity logs."
      />
    </div>
  );
}
