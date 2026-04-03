import { getCompany, deleteCompany, deleteCompanyAndRedirect } from '@/lib/actions';
import ProgressSection from '@/components/ProgressSection';
import ActivityTimeline from '@/components/ActivityTimeline';
import DeleteButton from '@/components/DeleteButton';
import FormattedText from '@/components/FormattedText';
import CopyTextButton from '@/components/CopyTextButton';
import { notFound } from 'next/navigation';
import { FileText, Edit3, ArrowLeft, Globe, Target } from 'lucide-react';

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
                <div className="border border-[#FF1744]/50 bg-[#FF1744]/10 rounded-2xl p-6 space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-[#FF1744]">Connection Problem</p>
                    <p className="text-sm text-[#FF1744]">{message}</p>
                    <a href="/dashboard" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FF1744] hover:text-[#ff5f7f]">
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-12 overflow-visible">
                <div className="flex-1 space-y-4">
                    <a href="/dashboard" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#E1E1E1]/70 hover:text-[#00F2FE] transition-colors">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </a>
                    <div>
                        <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-6">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none break-words max-w-[300px] md:max-w-none font-outfit">{company.company_name}</h2>
                            <div className="flex items-center gap-2 bg-[#161616] px-3 py-1 rounded-full border border-white/10 w-fit">
                                <Globe size={12} className="text-[#E1E1E1]/70" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/70">{company.application_platform || 'Direct'}</p>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-6">
                            <p className="text-xl md:text-2xl text-[#00F2FE] font-bold tracking-tight">{company.role_title}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60 mt-1">{company.location || 'Remote'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href={`/edit/${id}`}
                        className="flex items-center justify-center gap-2 bg-[#161616] border border-white/10 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#1d1d1d] transition-colors"
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
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/60">Current Progress</h3>
                            {company.next_action && (
                                <div className="flex items-center gap-3 bg-black px-4 py-2 rounded-xl w-fit border border-white/10 shadow-lg shadow-emerald-500/30">
                                    <Target size={14} className="text-[#00E676]" />
                                    <span className="text-[10px] font-black uppercase text-[#E1E1E1] tracking-tight">Next: {company.next_action}</span>
                                </div>
                            )}
                        </div>
                        <ProgressSection company={company} />
                    </section>

                    {company.resume_url && (
                        <section className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                <div className="space-y-1 text-[#E1E1E1]/70">
                                    <h3 className="text-sm font-black uppercase tracking-widest">Resume Preview</h3>
                                    <p className="text-xs font-medium">Original file used for this application.</p>
                                </div>
                                <a
                                    href={company.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#161616] text-[#00F2FE] px-6 py-4 sm:px-4 sm:py-2 rounded-xl sm:rounded text-xs sm:text-[10px] font-black uppercase tracking-widest hover:bg-[#1d1d1d] border border-[#00F2FE]/40 transition-all active:scale-95"
                                >
                                    <FileText size={16} /> Open Full PDF
                                </a>
                            </div>

                            {/* Desktop Preview */}
                            <div className="hidden md:block border border-white/10 rounded-3xl overflow-hidden aspect-[1/1.4] bg-[#161616]">
                                <iframe
                                    src={`${company.resume_url}#toolbar=0&navpanes=0&scrollbar=0`}
                                    className="w-full h-full"
                                    title="Resume Preview"
                                />
                            </div>

                            {/* Mobile Teaser/Preview Placeholder */}
                            <div className="md:hidden block bg-[#161616] border border-white/10 rounded-3xl p-10 text-center space-y-4">
                                <div className="w-16 h-16 bg-[#00F2FE]/20 rounded-2xl flex items-center justify-center mx-auto text-[#00F2FE]">
                                    <FileText size={32} strokeWidth={1.5} />
                                </div>
                                <p className="text-xs font-bold text-[#E1E1E1]/60 uppercase tracking-widest">PDF Preview hidden on mobile</p>
                            </div>
                        </section>
                    )}

                    {company.jd_text && (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#E1E1E1]/60">Job Description</h3>
                                <CopyTextButton text={company.jd_text} />
                            </div>
                            <div className="bg-[#161616] p-10 rounded-3xl border border-white/10 text-sm text-[#E1E1E1]/80">
                                <FormattedText text={company.jd_text} />
                            </div>
                        </section>
                    )}
                </div>

                {/* SIDE COLUMN */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="bg-[#161616] p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                        <ActivityTimeline logs={company.application_logs || []} />
                    </div>

                    <div className="space-y-8 p-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[#E1E1E1]/60 uppercase tracking-widest">Application Date</p>
                            <p className="font-bold text-sm tracking-tight">{new Date(company.date_applied).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                        </div>

                        {company.notes && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-[#E1E1E1]/60 uppercase tracking-widest">Internal Notes</p>
                                <p className="text-xs font-medium leading-relaxed bg-[#161616] p-4 rounded-xl border border-white/10 italic text-[#E1E1E1]/80">
                                    {company.notes}
                                </p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[#E1E1E1]/60 uppercase tracking-widest">Last Modified</p>
                            <p className="text-[10px] font-bold text-[#E1E1E1]/60">{new Date(company.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
