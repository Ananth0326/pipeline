import dynamic from 'next/dynamic';

const JobPipelineDashboard = dynamic(
  () => import('@/components/job-pipeline/JobPipelineDashboard'),
  { ssr: false }
);

export default function DashboardPage() {
  return <JobPipelineDashboard />;
}
