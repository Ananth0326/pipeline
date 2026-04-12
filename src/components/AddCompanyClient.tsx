'use client';

import CompanyForm from '@/components/CompanyForm';
import { addCompany, deleteSavedRole } from '@/lib/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddCompanyClientProps {
    initialCompanyName?: string;
    initialRoleTitle?: string;
    savedRoleId?: string;
}

export default function AddCompanyClient({ initialCompanyName, initialRoleTitle, savedRoleId }: AddCompanyClientProps) {
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
        <div className="mx-auto w-[min(980px,94%)] space-y-8 pt-28 md:pt-32 pb-10">
            <div>
                <a href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-[#78716C] hover:text-[#1C1917] transition-colors">Back - Cancel and Exit</a>
                <h2 className="text-5xl font-black uppercase tracking-tighter mt-4 text-[#1C1917]">NEW APPLICATION</h2>
                <p className="text-[#78716C] font-medium">Add a company to your pipeline.</p>
            </div>

            <div className="space-y-4">
                <CompanyForm
                    initialData={initialCompanyName || initialRoleTitle ? { company_name: initialCompanyName, role_title: initialRoleTitle } : undefined}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
