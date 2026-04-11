export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export type JobPipelineItem = {
  id: string | number;
  company: string;
  jobTitle: string;
  status: JobStatus;
  nextAction: string;
  location: string;
};
