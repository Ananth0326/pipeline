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
    const router = useRouter();

    useEffect(() => {
        getCompany(id).then(setCompany).catch(err => {
            console.error(err);
            alert('Failed to load application');
        });
    }, [id]);

    const handleSubmit = async (formData: any, resumeFile: File | null) => {
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

            await updateCompany(id, formData, undefined, resumeData);
            router.push(`/company/${id}`);
        } catch (error) {
            console.error('Failed to update company:', error);
            alert('Error updating application');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!company) return <div className="p-20 text-center font-black uppercase tracking-widest text-[#E1E1E1]/70">Loading Application...</div>;

    return (
        <div className="space-y-12">
            <div>
                <a href={`/company/${id}`} className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/70 hover:text-[#00F2FE] transition-colors">Back to Details</a>
                <h2 className="text-5xl font-black uppercase tracking-tighter mt-4 leading-none">EDIT INFO</h2>
                <p className="text-[#E1E1E1]/70 font-medium mt-2 underline decoration-white/20 underline-offset-4">{company.company_name}</p>
            </div>

            <div className="bg-[#161616] border border-white/10 rounded-3xl p-10 lg:p-16 backdrop-blur-md">
                <CompanyForm initialData={company} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}
