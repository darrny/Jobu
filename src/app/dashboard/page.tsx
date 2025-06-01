'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJobs } from '@/hooks/useJobs';
import { auth } from '@/lib/firebase';
import { JobApplication, JobType, JobStatus } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { createJob, updateJob, deleteJob } from '@/lib/firebase-utils';

import { Header } from '@/components/layout/header';
import JobFormDialog from '@/components/job/JobFormDialog';
import { StatsPanel } from '@/components/dashboard/stats-panel';
import { JobFilters } from '@/components/job/job-filters';
import EmptyState from '@/components/dashboard/EmptyState';
import JobList from '@/components/job/JobList';


export default function Dashboard() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
    const [typeFilter, setTypeFilter] = useState<JobType | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');

    const { toast } = useToast();
    const { jobs } = useJobs();
    const router = useRouter();

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push('/login');
            }
        });

        return () => unsubscribeAuth();
    }, [router]);

    const filteredJobs = jobs.filter(job => {
        if (typeFilter !== 'all' && job.type !== typeFilter) return false;
        if (statusFilter !== 'all' && job.status !== statusFilter) return false;
        return true;
    });

    const handleSubmit = async (data: Partial<JobApplication>) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user logged in');

            if (editingJob) {
                await updateJob(editingJob.id, data);
                toast({
                    title: "Success",
                    description: "Job application updated successfully",
                });
            } else {
                await createJob(user.uid, data as Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
                toast({
                    title: "Success",
                    description: "New job application added successfully",
                });
            }

            setIsFormOpen(false);
            setEditingJob(null);
        } catch (error) {
            console.error('Error submitting job:', error);
            toast({
                title: "Error",
                description: "There was an error processing your request",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (job: JobApplication) => {
        setEditingJob(job);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteJob(id);
            toast({
                title: "Success",
                description: "Job application deleted successfully",
            });
        } catch (error) {
            console.error('Error deleting job:', error);
            toast({
                title: "Error",
                description: "There was an error deleting the job application",
                variant: "destructive",
            });
        }
    };

    const resetFilters = () => {
        setTypeFilter('all');
        setStatusFilter('all');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">My Job Applications</h1>
                    <JobFormDialog
                        isOpen={isFormOpen}
                        onOpenChange={(open) => {
                            setIsFormOpen(open);
                            if (!open) setEditingJob(null);
                        }}
                        initialData={editingJob}
                        onSubmit={handleSubmit}
                    />
                </div>

                <div className="space-y-6">
                    <StatsPanel jobs={jobs} />

                    <JobFilters
                        typeFilter={typeFilter}
                        statusFilter={statusFilter}
                        onTypeChange={setTypeFilter}
                        onStatusChange={setStatusFilter}
                        onReset={resetFilters}
                    />

                    {filteredJobs.length === 0
                        ? <EmptyState hasJobs={jobs.length > 0} />
                        : <JobList jobs={filteredJobs} onEdit={handleEdit} onDelete={handleDelete} />
                    }
                </div>
            </main>
        </div>
    );
}