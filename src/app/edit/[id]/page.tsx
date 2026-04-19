'use client';

import CompanyForm from '@/components/CompanyForm';
import { getCompany, updateCompany } from '@/lib/actions';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Company } from '@/lib/types';

export default function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [company, setCompany] = useState<Company | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        getCompany(id).then(setCompany).catch(err => {
            console.error(err);
            setError('Failed to load application');
        });
    }, [id]);

    const handleSubmit = async (formData: any, resumeFile: File | null) => {
        setError('');
        setIsSubmitting(true);
        try {
            let resumeData = undefined;
            if (resumeFile) {
                resumeData = {
                    name: resumeFile.name,
                    type: resumeFile.type,
                    buffer: await resumeFile.arrayBuffer()
                };
            }

            const res = await updateCompany(id, formData, undefined, resumeData);
            if (res?.error) {
                setError(res.error);
            } else {
                router.push(`/company/${id}`);
            }
        } catch (err) {
            console.error('Failed to update company:', err);
            setError(err instanceof Error ? err.message : 'Error updating application');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!company) return <div className="p-20 text-center font-black uppercase tracking-widest text-[#78716C]">Loading Application...</div>;

    return (
        <div className="space-y-12">
            <div>
                <a href={`/company/${id}`} className="text-[10px] font-black uppercase tracking-widest text-[#78716C] hover:text-[#1C1917] transition-colors">Back to Details</a>
                <h2 className="text-5xl font-black uppercase tracking-tighter mt-4 leading-none text-[#1C1917]">EDIT INFO</h2>
                <p className="text-[#78716C] font-medium mt-2 underline decoration-black/20 underline-offset-4">{company.company_name}</p>
            </div>

            <div className="premium-card bg-white rounded-2xl p-10 lg:p-16">
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-600">Error</p>
                        <p className="mt-1 text-sm">{error}</p>
                    </div>
                )}
                <CompanyForm initialData={company} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}
