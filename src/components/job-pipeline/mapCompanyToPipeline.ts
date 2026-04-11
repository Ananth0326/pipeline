import type { Company } from '@/lib/types';
import type { JobPipelineItem, JobStatus } from './types';

function mapStatus(status: Company['status']): JobStatus {
  if (status === 'offer') return 'Offer';
  if (status === 'rejected') return 'Rejected';
  if (status === 'interview' || status === 'selected') return 'Interview';
  return 'Applied';
}

export function mapCompaniesToPipelineItems(companies: Company[]): JobPipelineItem[] {
  return companies.map((company) => ({
    id: company.id,
    company: company.company_name,
    jobTitle: company.role_title || 'Untitled Role',
    status: mapStatus(company.status),
    nextAction: company.next_action || 'Review latest update',
    location: company.location || 'Location not set',
  }));
}
