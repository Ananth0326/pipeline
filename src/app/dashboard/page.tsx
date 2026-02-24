import { getCompanies } from '@/lib/actions';
import CompanyTable from '@/components/CompanyTable';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const companies = await getCompanies();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end px-1">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">Pipeline</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Track your progress and stay organized.</p>
                </div>
                <a
                    href="/add-company"
                    className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/10"
                >
                    Add Application
                </a>
            </div>

            <div>
                <CompanyTable companies={companies} />
            </div>
        </div>
    );
}
