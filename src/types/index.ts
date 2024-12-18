export type JobType = 'full-time' | 'part-time' | 'internship' | 'freelance';

export type JobStatus = 'applied' | 'in-progress' | 'offered' | 'rejected' | 'accepted';

export interface JobEvent {
  id: string;
  type: 'interview' | 'assessment' | 'follow-up' | 'other';
  date: Date;
  notes?: string;
  completed: boolean;
}

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  applicationLink: string;
  type: JobType;
  status: JobStatus;
  dateApplied: Date;
  events: JobEvent[];
  createdAt?: Date;
  updatedAt?: Date;
}