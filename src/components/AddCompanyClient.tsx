'use client';

import CompanyForm from '@/components/CompanyForm';
import { addCompany, deleteSavedRole } from '@/lib/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddCompanyClientProps {
    initialCompanyName?: string;
    savedRoleId?: string;
}

export default function AddCompanyClient({ initialCompanyName, savedRoleId }: AddCompanyClientProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

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

            await addCompany(formData, resumeData);
            if (savedRoleId) {
                await deleteSavedRole(savedRoleId);
            }
            router.push('/dashboard');
        } catch (error) {
            console.error('Failed to add company:', error);
            alert('Error adding application');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <a href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-[#E1E1E1]/70 hover:text-[#00F2FE] transition-colors">Back - Cancel and Exit</a>
                <h2 className="text-5xl font-black uppercase tracking-tighter mt-4">NEW APPLICATION</h2>
                <p className="text-[#E1E1E1]/70 font-medium">Add a company to your pipeline.</p>
            </div>

            <div className="bg-[#161616] border border-white/10 rounded-3xl p-10 lg:p-16 backdrop-blur-md">
                <CompanyForm
                    initialData={initialCompanyName ? { company_name: initialCompanyName } : undefined}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
