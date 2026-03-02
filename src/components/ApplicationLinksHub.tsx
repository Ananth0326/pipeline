import { Company } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

interface ApplicationLinksHubProps {
    companies: Company[];
}

function getStatusStyles(color: Company['status_color']) {
    if (color === 'green') return 'bg-green-50 text-green-700 border-green-200';
    if (color === 'red') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-yellow-50 text-yellow-700 border-yellow-200';
}

function toHref(value: string) {
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export default function ApplicationLinksHub({ companies }: ApplicationLinksHubProps) {
    const linkRows = companies.flatMap((company) => {
        const links = (company.application_links || '')
            .split('\n')
            .map((link) => link.trim())
            .filter(Boolean);

        return links.map((link) => ({
            id: `${company.id}-${link}`,
            companyName: company.company_name,
            roleTitle: company.role_title,
            statusText: company.status_text || 'Applied',
            statusColor: company.status_color || 'yellow',
            nextAction: company.next_action || 'None',
            link
        }));
    });

    if (linkRows.length === 0) {
        return (
            <section className="rounded-2xl border border-dashed border-gray-200 p-6 bg-gray-50/60">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Application Links Hub</h3>
                <p className="mt-2 text-sm text-gray-500">No links saved yet. Add links in any company form to see everything here.</p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Application Links Hub</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{linkRows.length} links</p>
            </div>

            <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
                <div className="max-h-[380px] overflow-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Company</th>
                                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Next Action</th>
                                <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {linkRows.map((row) => (
                                <tr key={row.id} className="border-b last:border-0 border-gray-100 hover:bg-gray-50/60">
                                    <td className="px-4 py-3 font-semibold text-gray-800">{row.companyName}</td>
                                    <td className="px-4 py-3 text-gray-600">{row.roleTitle}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(row.statusColor)}`}>
                                            {row.statusText}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{row.nextAction}</td>
                                    <td className="px-4 py-3 text-right">
                                        <a
                                            href={toHref(row.link)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
                                        >
                                            Open <ExternalLink size={12} />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
