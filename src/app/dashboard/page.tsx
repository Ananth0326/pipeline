import { getCompanies, getSavedRoles } from '@/lib/actions';
import CompanyTable from '@/components/CompanyTable';
import SavedRolesModal from '@/components/SavedRolesModal';
import SavedRoleNotifier from '@/components/SavedRoleNotifier';
import QuickAddModal from '@/components/QuickAddModal';
import type { Company, SavedRole } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let companies: Company[] = [];
  let savedRoles: SavedRole[] = [];
  let loadError = '';

  try {
    companies = await getCompanies();
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Unable to load applications right now.';
  }

  try {
    savedRoles = await getSavedRoles();
  } catch (error) {
    if (!loadError) {
      loadError = error instanceof Error ? error.message : 'Unable to load saved roles right now.';
    }
  }

  return (
    <div className="relative mx-auto w-[min(1220px,94%)] space-y-6 pb-10 pt-28">
      <section className="premium-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#78716C]">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#1C1917] md:text-4xl">Pipeline Overview</h1>
            <p className="mt-2 text-sm text-[#78716C]">Kanban-first workflow with condensed list scanning and saved-role conversion.</p>
          </div>
          <SavedRolesModal savedRoles={savedRoles} />
        </div>
      </section>

      {loadError ? (
        <div className="premium-card border-red-200 bg-red-50 p-4 text-red-700">
          <p className="text-xs font-black uppercase tracking-[0.16em]">Connection Problem</p>
          <p className="mt-1 text-sm">{loadError}</p>
        </div>
      ) : null}

      <CompanyTable companies={companies} />
      <SavedRoleNotifier />
      <QuickAddModal />
    </div>
  );
}
