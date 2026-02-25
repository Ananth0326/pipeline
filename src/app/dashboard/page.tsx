import { getCompanies } from '@/lib/actions';
import CompanyTable from '@/components/CompanyTable';
import QuickAddModal from '@/components/QuickAddModal';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const companies = await getCompanies();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end px-1">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tighter uppercase leading-none font-outfit">DASHBOARD</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Track your progress and stay organized.</p>
                </div>
            </div>

            <div>
                <CompanyTable companies={companies} />
            </div>

            <QuickAddModal />
        </div>
    );
}
