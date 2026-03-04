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
                <a href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">â† Cancel and Exit</a>
                <h2 className="text-5xl font-black uppercase tracking-tighter mt-4">NEW APPLICATION</h2>
                <p className="text-gray-400 font-medium">Add a company to your pipeline.</p>
            </div>

            <div className="bg-white dark:bg-black border rounded-3xl p-10 lg:p-16 shadow-sm">
                <CompanyForm
                    initialData={initialCompanyName ? { company_name: initialCompanyName } : undefined}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
