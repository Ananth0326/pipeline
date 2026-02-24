'use server';

import { supabase } from '@/lib/supabase';
import { Company, ApplicationStatus, AppLog, AssessmentResponse } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function logActivity(companyId: string, action: string) {
    const { error } = await supabase
        .from('application_logs')
        .insert([{ company_id: companyId, action }]);
    if (error) console.error('Logging failed:', error);
}

function computeNextAction(company: Partial<Company>): string {
    if (company.status === 'rejected') return 'Archive and move on';

    if (company.status === 'selected') {
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
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as Company[];
}

export async function getCompany(id: string) {
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
}

async function uploadResume(companyName: string, resumeFile: { name: string, type: string, buffer: ArrayBuffer }) {
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
    let resumeUrl = null;

    if (resumeFile && data.company_name) {
        resumeUrl = await uploadResume(data.company_name, resumeFile);
    }

    // Auto-fill next action if not provided
    if (!data.next_action) {
        data.next_action = computeNextAction(data);
    }

    const { data: inserted, error } = await supabase
        .from('companies')
        .insert([{ ...data, resume_url: resumeUrl }])
        .select()
        .single();

    if (error) throw error;

    await logActivity(inserted.id, 'Application Created');
    revalidatePath('/dashboard');
}

export async function updateCompany(
    id: string,
    updates: Partial<Company>,
    logMessage?: string,
    resumeFile?: { name: string, type: string, buffer: ArrayBuffer }
) {
    // If status is changed but next_action isn't manually provided, auto-compute it
    // Note: For existing companies, we fetch current state to merge for computation
    if (updates.status || updates.assessment_done !== undefined || updates.assessment_response || updates.qualified !== undefined || updates.interview_date) {
        const { data: current } = await supabase.from('companies').select('*').eq('id', id).single();
        if (current) {
            const merged = { ...current, ...updates };
            if (!updates.next_action) {
                updates.next_action = computeNextAction(merged);
            }
        }
    }

    // Auto-clear logic: If status is changed to 'rejected', clear assessment and interview fields
    if (updates.status === 'rejected') {
        updates.assessment_done = false;
        updates.assessment_response = undefined;
        updates.qualified = undefined;
        updates.interview_date = undefined;
    }

    // Micro UX: If Assessment Response is set to 'no_response', clear further fields
    if (updates.assessment_response === 'no_response') {
        updates.qualified = undefined;
        updates.interview_date = undefined;
    }

    // Handle Resume Update
    if (resumeFile && (updates.company_name || updates.id)) {
        const companyNameForFile = updates.company_name || 'update';
        const resumeUrl = await uploadResume(companyNameForFile, resumeFile);
        updates.resume_url = resumeUrl;
        if (!logMessage) logMessage = 'Resume Updated';
    }

    const { error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id);

    if (error) throw error;

    if (logMessage) {
        await logActivity(id, logMessage);
    }

    revalidatePath('/dashboard');
    revalidatePath(`/company/${id}`);
}

export async function deleteCompany(id: string) {
    const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/dashboard');
}

export async function deleteCompanyAndRedirect(id: string) {
    const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/dashboard');
    redirect('/dashboard');
}
