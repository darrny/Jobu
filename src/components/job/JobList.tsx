import { JobApplication } from "@/types";
import { JobCard } from "@/components/job/job-card";

export default function JobList({ jobs, onEdit, onDelete }: {
    jobs: JobApplication[];
    onEdit: (job: JobApplication) => void;
    onDelete: (id: string) => void;
}) {
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
                <JobCard
                    key={job.id}
                    job={job}
                    onEdit={() => onEdit(job)}
                    onDelete={() => onDelete(job.id)}
                />
            ))}
        </div>
    );
}
    