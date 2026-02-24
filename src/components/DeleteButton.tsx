'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import { deleteCompanyAndRedirect } from '@/lib/actions';

interface DeleteButtonProps {
    id: string;
    companyName: string;
}

export default function DeleteButton({ id, companyName }: DeleteButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        await deleteCompanyAndRedirect(id);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 text-red-600 bg-red-50/50 border border-red-100 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-colors"
            >
                <Trash2 size={16} /> Delete
            </button>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title={`Delete ${companyName}?`}
                message="This will permanently remove this application, its resume link, and all activity logs. This action cannot be undone."
            />
        </>
    );
}
