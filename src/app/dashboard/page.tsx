import JobPipelineDashboard from '@/components/job-pipeline/JobPipelineDashboard';
import { mapCompaniesToPipelineItems } from '@/components/job-pipeline/mapCompanyToPipeline';
import { getCompanies } from '@/lib/actions';
import type { Company } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let companies: Company[] = [];
  try {
    companies = await getCompanies();
  } catch {
    companies = [];
  }
  const items = mapCompaniesToPipelineItems(companies);

  return <JobPipelineDashboard items={items} />;
}
