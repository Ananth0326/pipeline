export type ApplicationStatus = 'applied' | 'selected' | 'rejected' | 'interview' | 'offer';
export type AssessmentResponse = 'response' | 'no_response';

export interface Company {
    id: string;
    company_name: string;
    role_title: string;
    location?: string;
    jd_text?: string;
    resume_url?: string;
    date_applied: string;
    status: ApplicationStatus;
    status_text: string;
    status_color: 'green' | 'yellow' | 'red';
    notes?: string;
    assessment_done: boolean;
    assessment_response?: AssessmentResponse;
    qualified?: boolean;
    interview_date?: string;
    application_platform?: string;
    next_action?: string;
    created_at: string;
    updated_at: string;
}

export interface AppLog {
    id: string;
    company_id: string;
    action: string;
    created_at: string;
}
