'use client';

import { addSavedRole, deleteSavedRole, updateSavedRole } from '@/lib/actions';
import { SavedRole } from '@/lib/types';
import { ExternalLink, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

interface SavedRolesSectionProps {
    savedRoles: SavedRole[];
}

interface RoleFormState {
    company_name: string;
    job_link: string;
}

function normalizeLink(url: string) {
    if (!url) return '';
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function SavedRolesSection({ savedRoles }: SavedRolesSectionProps) {
    const [form, setForm] = useState<RoleFormState>({ company_name: '', job_link: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<RoleFormState>({ company_name: '', job_link: '' });
    const [deleting, setDeleting] = useState<SavedRole | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await addSavedRole({
                company_name: form.company_name.trim(),
                job_link: normalizeLink(form.job_link.trim())
            });
            setForm({ company_name: '', job_link: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add role.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEdit = (role: SavedRole) => {
        setEditingId(role.id);
        setEditForm({
            company_name: role.company_name,
            job_link: role.job_link
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ company_name: '', job_link: '' });
    };

    const handleUpdate = async (id: string) => {
        setError('');
        setIsSubmitting(true);
        try {
            await updateSavedRole(id, {
                company_name: editForm.company_name.trim(),
                job_link: normalizeLink(editForm.job_link.trim())
            });
            cancelEdit();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update role.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleting) return;
        setError('');
        setIsSubmitting(true);
        try {
            await deleteSavedRole(deleting.id);
            setDeleting(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete role.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Saved Roles</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Store interesting roles before applying.</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{savedRoles.length} items</span>
            </div>

            <form onSubmit={handleAdd} className="rounded-2xl border border-gray-100 p-4 bg-white grid grid-cols-1 md:grid-cols-12 gap-3">
                <input
                    required
                    value={form.company_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, company_name: e.target.value }))}
                    placeholder="Company name"
                    className="md:col-span-4 border-2 border-gray-100 p-3 rounded-xl text-sm font-semibold outline-none focus:ring-4 focus:ring-gray-50"
                />
                <input
                    required
                    type="url"
                    value={form.job_link}
                    onChange={(e) => setForm((prev) => ({ ...prev, job_link: e.target.value }))}
                    placeholder="https://job-link"
                    className="md:col-span-6 border-2 border-gray-100 p-3 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-gray-50"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400"
                >
                    <Plus size={14} /> Add
                </button>
            </form>

            {error && (
                <div className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs">{error}</div>
            )}

            <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
                {savedRoles.length === 0 ? (
                    <div className="px-6 py-10 text-sm text-gray-500 italic bg-gray-50/60">No saved roles yet.</div>
                ) : (
                    <div className="overflow-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Company</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Job Link</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedRoles.map((role) => {
                                    const isEditing = editingId === role.id;
                                    return (
                                        <tr key={role.id} className="border-b last:border-0 border-gray-100">
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <input
                                                        value={editForm.company_name}
                                                        onChange={(e) => setEditForm((prev) => ({ ...prev, company_name: e.target.value }))}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                    />
                                                ) : (
                                                    <a
                                                        href={role.job_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800"
                                                    >
                                                        {role.company_name} <ExternalLink size={12} />
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <input
                                                        type="url"
                                                        value={editForm.job_link}
                                                        onChange={(e) => setEditForm((prev) => ({ ...prev, job_link: e.target.value }))}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-500 truncate block max-w-[380px]">{role.job_link}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUpdate(role.id)}
                                                                disabled={isSubmitting}
                                                                className="px-3 py-2 rounded-lg bg-black text-white text-[10px] font-black uppercase tracking-widest disabled:bg-gray-400"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={cancelEdit}
                                                                className="px-3 py-2 rounded-lg border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => startEdit(role)}
                                                                className="px-3 py-2 rounded-lg border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-600 inline-flex items-center gap-1"
                                                            >
                                                                <Pencil size={12} /> Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleting(role)}
                                                                className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-[10px] font-black uppercase tracking-widest text-red-600 inline-flex items-center gap-1"
                                                            >
                                                                <Trash2 size={12} /> Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={handleDelete}
                title={deleting ? `Delete ${deleting.company_name}?` : 'Delete saved role?'}
                message="This will permanently remove this saved role. This action cannot be undone."
            />
        </section>
    );
}
