import { JobApplication } from "@/types";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { JobApplicationForm } from "@/components/forms/job-application-form";

export default function JobFormDialog({ isOpen, onOpenChange, initialData, onSubmit }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: JobApplication | null;
    onSubmit: (data: Partial<JobApplication>) => void;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Application
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogTitle>{initialData ? 'Edit Application' : 'Add New Application'}</DialogTitle>
                <JobApplicationForm onSubmit={onSubmit} initialData={initialData || undefined} />
            </DialogContent>
        </Dialog>
    );
}