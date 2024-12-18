'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { JobApplication, JobType, JobStatus } from '@/types';
import { JobCard } from '@/components/job/job-card';
import { JobApplicationForm } from '@/components/forms/job-application-form';
import { Header } from '@/components/layout/header';
import { JobFilters } from '@/components/job/job-filters';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createJob, updateJob, deleteJob } from '@/lib/firebase-utils';
import { StatsPanel } from '@/components/dashboard/stats-panel';
import { Timestamp } from 'firebase/firestore';

export default function Dashboard() {
    const [jobs, setJobs] = useState<JobApplication[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
    const [typeFilter, setTypeFilter] = useState<JobType | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push('/login');
            }
        });

        return () => unsubscribeAuth();
    }, [router]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const jobsQuery = query(
            collection(db, 'jobs'),
            where('userId', '==', user.uid)
        );

        const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
            const jobsData = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    dateApplied: data.dateApplied instanceof Timestamp
                        ? data.dateApplied.toDate()
                        : new Date(data.dateApplied),
                    createdAt: data.createdAt?.toDate(),
                    updatedAt: data.updatedAt?.toDate(),
                    events: data.events?.map((event: any) => ({
                        ...event,
                        date: event.date instanceof Timestamp
                            ? event.date.toDate()
                            : new Date(event.date)
                    })) || []
                } as JobApplication;
            });

            setJobs(jobsData.sort((a, b) => b.dateApplied.getTime() - a.dateApplied.getTime()));
        });

        return () => unsubscribeJobs();
    }, []);

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
                    <Dialog open={isFormOpen} onOpenChange={(open) => {
                        setIsFormOpen(open);
                        if (!open) setEditingJob(null);
                    }}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Application
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogTitle>{editingJob ? 'Edit Application' : 'Add New Application'}</DialogTitle>
                            <JobApplicationForm
                                onSubmit={handleSubmit}
                                initialData={editingJob || undefined}
                            />
                        </DialogContent>
                    </Dialog>
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

                    {filteredJobs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                {jobs.length === 0
                                    ? "No job applications yet. Click 'Add New Application' to get started!"
                                    : "No applications match your filters."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.map((job: JobApplication) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}