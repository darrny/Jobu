export default function EmptyState({ hasJobs }: { hasJobs: boolean }) {
    return (
        <div className="text-center py-12 text-gray-500">
            {hasJobs
                ? "No applications match your filters."
                : "No job applications yet. Click 'Add New Application' to get started!"}
        </div>
    );
}