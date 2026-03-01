import { getCompany, deleteCompany, deleteCompanyAndRedirect } from '@/lib/actions';
import ProgressSection from '@/components/ProgressSection';
import ActivityTimeline from '@/components/ActivityTimeline';
import DeleteButton from '@/components/DeleteButton';
import FormattedText from '@/components/FormattedText';
import { notFound } from 'next/navigation';
import { FileText, Trash2, Edit3, ArrowLeft, Globe, Target } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let company: Awaited<ReturnType<typeof getCompany>> | null = null;

    try {
        company = await getCompany(id);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to connect to database right now.';
        return (
            <div className="pt-12 md:pt-24 pb-20 px-6 max-w-5xl mx-auto">
                <div className="border border-red-200 bg-red-50 rounded-2xl p-6 space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">Connection Problem</p>
                    <p className="text-sm text-red-700">{message}</p>
                    <a href="/dashboard" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-800 hover:text-red-900">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    if (!company) {
        notFound();
    }

    return (
        <div className="pt-12 md:pt-24 pb-20 px-6 max-w-5xl mx-auto space-y-12">
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b pb-12 overflow-visible">
                <div className="flex-1 space-y-4">
                    <a href="/dashboard" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </a>
                    <div>
                        <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-6">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none break-words max-w-[300px] md:max-w-none font-outfit">{company.company_name}</h2>
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 w-fit">
                                <Globe size={12} className="text-gray-400" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{company.application_platform || 'Direct'}</p>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-6">
                            <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-bold tracking-tight">{company.role_title}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{company.location || 'Remote'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href={`/edit/${id}`}
                        className="flex items-center justify-center gap-2 bg-gray-50 border border-gray-100 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-colors"
                    >
                        <Edit3 size={16} /> Edit Info
                    </a>
                    <DeleteButton id={id} companyName={company.company_name} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* MAIN COLUMN */}
                <div className="lg:col-span-8 space-y-12 md:space-y-16">
                    <section>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Progress</h3>
                            {company.next_action && (
                                <div className="flex items-center gap-3 bg-black dark:bg-white px-4 py-2 rounded-xl w-fit">
                                    <Target size={14} className="text-white dark:text-black" />
                                    <span className="text-[10px] font-black uppercase text-white dark:text-black tracking-tight">Next: {company.next_action}</span>
                                </div>
                            )}
                        </div>
                        <ProgressSection company={company} />
                    </section>

                    {company.resume_url && (
                        <section className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                <div className="space-y-1 text-gray-400">
                                    <h3 className="text-sm font-black uppercase tracking-widest">Resume Preview</h3>
                                    <p className="text-xs font-medium">Original file used for this application.</p>
                                </div>
                                <a
                                    href={company.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-6 py-4 sm:px-4 sm:py-2 rounded-xl sm:rounded text-xs sm:text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 border border-blue-200 transition-all active:scale-95"
                                >
                                    <FileText size={16} /> Open Full PDF
                                </a>
                            </div>

                            {/* Desktop Preview */}
                            <div className="hidden md:block border-4 border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden aspect-[1/1.4] bg-gray-50">
                                <iframe
                                    src={`${company.resume_url}#toolbar=0&navpanes=0&scrollbar=0`}
                                    className="w-full h-full"
                                    title="Resume Preview"
                                />
                            </div>

                            {/* Mobile Teaser/Preview Placeholder */}
                            <div className="md:hidden block bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-3xl p-10 text-center space-y-4">
                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto text-blue-500">
                                    <FileText size={32} strokeWidth={1.5} />
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">PDF Preview hidden on mobile</p>
                            </div>
                        </section>
                    )}

                    {company.jd_text && (
                        <section className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Job Description</h3>
                            <div className="bg-gray-50 dark:bg-gray-950 p-10 rounded-3xl border dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                                <FormattedText text={company.jd_text} />
                            </div>
                        </section>
                    )}
                </div>

                {/* SIDE COLUMN */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="bg-gray-50 dark:bg-gray-950 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                        <ActivityTimeline logs={company.application_logs || []} />
                    </div>

                    <div className="space-y-8 p-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Application Date</p>
                            <p className="font-bold text-sm tracking-tight">{new Date(company.date_applied).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                        </div>

                        {company.notes && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Internal Notes</p>
                                <p className="text-xs font-medium leading-relaxed bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/50 italic text-yellow-900 dark:text-yellow-200">
                                    {company.notes}
                                </p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Modified</p>
                            <p className="text-[10px] font-bold text-gray-400">{new Date(company.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
