import { getCompanies, getSavedRoles } from '@/lib/actions';
import CompanyTable from '@/components/CompanyTable';
import QuickAddModal from '@/components/QuickAddModal';
import SavedRolesModal from '@/components/SavedRolesModal';
import SearchModal from '@/components/SearchModal';
import AmbientOrbs from '@/components/AmbientOrbs';
import { Company, SavedRole } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    let companies: Company[] = [];
    let savedRoles: SavedRole[] = [];
    let loadError = '';

    try {
        companies = await getCompanies();
    } catch (error) {
        loadError = error instanceof Error ? error.message : 'Unable to connect to Supabase right now.';
    }

    try {
        savedRoles = await getSavedRoles();
    } catch (error) {
        if (!loadError) {
            loadError = error instanceof Error ? error.message : 'Unable to load saved roles right now.';
        }
    }

    return (
        <div className="relative space-y-6 overflow-hidden">
            <AmbientOrbs />
            <div className="flex justify-between items-end px-1">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tighter uppercase leading-none font-outfit">DASHBOARD</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60">Track your progress and stay organized.</p>
                </div>
                <SavedRolesModal savedRoles={savedRoles} />
            </div>

            {loadError && (
                <div className="px-4 py-3 rounded-xl border border-[#FF1744]/50 bg-[#FF1744]/10 text-[#FF1744]">
                    <p className="text-[10px] font-black uppercase tracking-widest">Connection Problem</p>
                    <p className="text-sm">{loadError}</p>
                </div>
            )}

            <div>
                <CompanyTable companies={companies} />
            </div>

            <QuickAddModal />
            <SearchModal companies={companies} />
        </div>
    );
}
