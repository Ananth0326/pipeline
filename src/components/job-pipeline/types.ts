export type JobStatus = 'Pending' | 'Interview' | 'Offer' | 'Rejected';

export type JobPipelineItem = {
  id: number;
  company: string;
  jobTitle: string;
  progress: number;
  status: JobStatus;
  nextAction: string;
};
