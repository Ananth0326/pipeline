'use server';

import { getSupabase } from '@/lib/supabase';
import { Company, ApplicationStatus, AppLog, AssessmentResponse, SavedRole } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function toUserFacingError(error: unknown, fallback: string): Error {
    const message = error instanceof Error ? error.message : '';
    const lower = message.toLowerCase();

    if (lower.includes('abort') || lower.includes('timeout') || lower.includes('fetch failed') || lower.includes('failed to fetch')) {
        return new Error('Supabase did not respond in time. Check NEXT_PUBLIC_SUPABASE_URL and your network, then try again.');
    }

    return new Error(message || fallback);
}

async function logActivity(companyId: string, action: string) {
    const supabase = getSupabase();
    const { error } = await supabase
        .from('application_logs')
        .insert([{ company_id: companyId, action }]);
    if (error) console.error('Logging failed:', error);
}

function computeNextAction(company: Partial<Company>): string {
    if (company.status === 'offer') return 'Review offer and negotiate';
    if (company.status === 'rejected') return 'Archive and move on';

    if (company.status === 'selected' || company.status === 'interview') {
        if (company.interview_date) return `Prepare for interview on ${new Date(company.interview_date).toLocaleDateString()}`;
        if (company.qualified === true) return 'Schedule interview';
        if (company.qualified === false) return 'Wait for feedback';
        if (company.assessment_response === 'response') return 'Review assessment feedback';
        if (company.assessment_response === 'no_response') return 'Follow up on assessment';
        if (company.assessment_done) return 'Wait for assessment results';
        return 'Complete assessment';
    }

    return 'Wait for response';
}

export async function getCompanies() {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data as Company[];
    } catch (error) {
        throw toUserFacingError(error, 'Failed to load companies.');
    }
}

export async function getCompany(id: string) {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('companies')
            .select('*, application_logs (*)')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (data.application_logs) {
            data.application_logs.sort((a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        }

        return data as Company & { application_logs: AppLog[] };
    } catch (error) {
        throw toUserFacingError(error, 'Failed to load application details.');
    }
}


async function uploadResume(companyName: string, resumeFile: { name: string, type: string, buffer: ArrayBuffer }) {
    const supabase = getSupabase();
    const uuid = crypto.randomUUID();
    const fileName = `resumes/${companyName.replace(/\s+/g, '_')}-${uuid}.pdf`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile.buffer, {
            contentType: resumeFile.type,
        });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

    return publicUrl;
}

export async function addCompany(data: Partial<Company>, resumeFile?: { name: string, type: string, buffer: ArrayBuffer }) {
    try {
        const supabase = getSupabase();
        let resumeUrl = null;

        if (resumeFile && data.company_name) {
            resumeUrl = await uploadResume(data.company_name, resumeFile);
        }

        // Auto-fill next action if not provided
        if (!data.next_action) {
            data.next_action = computeNextAction(data);
        }

        // Default manual status if not provided
        if (data.status === undefined) data.status = 'applied';
        if (data.status_text === undefined) data.status_text = 'Applied';
        if (data.status_color === undefined) data.status_color = 'yellow';

        const { data: inserted, error } = await supabase
            .from('companies')
            .insert([{ ...data, resume_url: resumeUrl }])
            .select()
            .single();

        if (error) {
            console.error('Supabase Error (addCompany):', error);
            return { error: error.message };
        }

        await logActivity(inserted.id, 'Application Created');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Action Error (addCompany):', error);
        return { error: toUserFacingError(error, 'Failed to add application.').message };
    }
}

export async function updateCompany(
    id: string,
    updates: Partial<Company>,
    logMessage?: string,
    resumeFile?: { name: string, type: string, buffer: ArrayBuffer }
) {
    try {
        const supabase = getSupabase();

        // If status/assessment fields are changed, auto-compute next_action
        if (updates.status || updates.status_text || updates.assessment_done !== undefined || updates.assessment_response || updates.qualified !== undefined || updates.interview_date) {
            const { data: current } = await supabase.from('companies').select('*').eq('id', id).single();
            if (current) {
                const merged = { ...current, ...updates };
                if (!updates.next_action) {
                    updates.next_action = computeNextAction(merged);
                }
            }
        }

        // Default status_text if it becomes empty
        if (updates.status_text === '') {
            updates.status_text = 'Applied';
        }

        // Auto-clear logic: If status is changed to 'rejected', clear assessment and interview fields
        if (updates.status === 'rejected' || updates.status_color === 'red') {
            updates.assessment_done = false;
            updates.assessment_response = undefined;
            updates.qualified = undefined;
            updates.interview_date = undefined;
        }

        // Handle Resume Update
        if (resumeFile) {
            // Fetch name if we don't have it
            let companyName = updates.company_name;
            if (!companyName) {
                const { data } = await supabase.from('companies').select('company_name').eq('id', id).single();
                companyName = data?.company_name || 'update';
            }
            const resumeUrl = await uploadResume(companyName as string, resumeFile);
            updates.resume_url = resumeUrl;
            if (!logMessage) logMessage = 'Resume Updated';
        }

        const { error } = await supabase
            .from('companies')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Supabase Error (updateCompany):', error);
            return { error: error.message };
        }

        if (logMessage) {
            await logActivity(id, logMessage);
        }

        revalidatePath('/dashboard');
        revalidatePath(`/company/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Action Error (updateCompany):', error);
        return { error: toUserFacingError(error, 'Failed to update application.').message };
    }
}

export async function deleteCompany(id: string) {
    try {
        const supabase = getSupabase();
        const { error } = await supabase
            .from('companies')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase Error (deleteCompany):', error);
            return { error: error.message };
        }
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Action Error (deleteCompany):', error);
        return { error: toUserFacingError(error, 'Failed to delete application.').message };
    }
}

export async function deleteCompanyAndRedirect(id: string) {
    try {
        const supabase = getSupabase();
        const { error } = await supabase
            .from('companies')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase Error (deleteCompanyAndRedirect):', error);
            return { error: error.message };
        }
    } catch (error) {
        console.error('Action Error (deleteCompanyAndRedirect):', error);
        return { error: toUserFacingError(error, 'Failed to delete application.').message };
    }
    revalidatePath('/dashboard');
    redirect('/dashboard');
}

export async function getSavedRoles() {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('saved_roles')
            .select('*')
            .or('is_converted.is.null,is_converted.eq.false')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data as SavedRole[];
    } catch (error) {
        throw toUserFacingError(error, 'Failed to load saved roles.');
    }
}

export async function addSavedRole(payload: Pick<SavedRole, 'company_name' | 'job_link'> & Partial<Pick<SavedRole, 'role_title'>>) {
    try {
        const supabase = getSupabase();
        const { error } = await supabase
            .from('saved_roles')
            .insert([payload]);

        if (error) {
            console.error('Supabase Error (addSavedRole):', error);
            return { error: error.message };
        }
        revalidatePath('/dashboard');
    } catch (error) {
        console.error('Action Error (addSavedRole):', error);
        return { error: toUserFacingError(error, 'Failed to add saved role.').message };
    }
}

export async function updateSavedRole(id: string, updates: Partial<Pick<SavedRole, 'company_name' | 'job_link' | 'role_title' | 'is_converted'>>) {
    try {
        const supabase = getSupabase();
        const { error } = await supabase
            .from('saved_roles')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Supabase Error (updateSavedRole):', error);
            return { error: error.message };
        }
        revalidatePath('/dashboard');
    } catch (error) {
        console.error('Action Error (updateSavedRole):', error);
        return { error: toUserFacingError(error, 'Failed to update saved role.').message };
    }
}

export async function deleteSavedRole(id: string) {
    try {
        const supabase = getSupabase();
        const { error } = await supabase
            .from('saved_roles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase Error (deleteSavedRole):', error);
            return { error: error.message };
        }
        revalidatePath('/dashboard');
    } catch (error) {
        console.error('Action Error (deleteSavedRole):', error);
        return { error: toUserFacingError(error, 'Failed to delete saved role.').message };
    }
}
