'use client';

import { useState } from 'react';
import { JobApplication, JobEvent } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Building2,
    CalendarDays,
    Link as LinkIcon,
    Plus,
    Trash2
} from 'lucide-react';
import { EventForm } from '../forms/event-form';
import { addJobEvent, deleteJobEvent, updateJob } from '@/lib/firebase-utils';
import { useToast } from '@/components/ui/use-toast';
import { Timestamp } from 'firebase/firestore';


interface JobCardProps {
    job: JobApplication;
    onEdit: (job: JobApplication) => void;
    onDelete: (id: string) => void;
}

const statusColors = {
    'applied': 'bg-blue-500',
    'in-progress': 'bg-yellow-500',
    'offered': 'bg-green-500',
    'rejected': 'bg-red-500',
    'accepted': 'bg-emerald-500',
} as const;

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const { toast } = useToast();

    const handleAddEvent = async (event: Omit<JobEvent, 'id'>) => {
        try {
            await addJobEvent(job.id, event);
            setIsEventFormOpen(false);
            toast({
                title: "Event added",
                description: "Event has been added successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add event",
                variant: "destructive",
            });
        }
    };

    const handleToggleEventComplete = async (eventId: string) => {
        try {
            const event = job.events.find(e => e.id === eventId);
            if (!event) return;

            const updatedEvents = job.events.map(e =>
                e.id === eventId ? { ...e, completed: !e.completed } : e
            );

            await updateJob(job.id, { events: updatedEvents });
            toast({
                title: "Event updated",
                description: `Event marked as ${!event.completed ? 'completed' : 'incomplete'}`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update event",
                variant: "destructive",
            });
        }
    };

    const formatDate = (date: Date | Timestamp) => {
        if (date instanceof Timestamp) {
            return format(date.toDate(), 'MMM dd, yyyy');
        }
        return format(date, 'MMM dd, yyyy');
    };

    const handleDeleteEvent = async (eventId: string) => {
        try {
            await deleteJobEvent(job.id, eventId);
            toast({
                title: "Event deleted",
                description: "Event has been deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete event",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="w-full hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{job.jobTitle}</h3>
                    <Badge variant="outline" className={statusColors[job.status]}>
                        {job.status}
                    </Badge>
                </div>
                <div className="flex items-center text-gray-500 space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>{job.companyName}</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-500">
                    <CalendarDays className="h-4 w-4" />
                    <span>Applied on {formatDate(job.dateApplied)}</span>
                </div>

                {job.applicationLink && (
                    <div className="flex items-center space-x-2">
                        <LinkIcon className="h-4 w-4" />
                        <a
                            href={job.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline truncate"
                        >
                            Application Link
                        </a>
                    </div>
                )}

                {job.events && job.events.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Events</h4>
                        <div className="space-y-2">
                            {job.events
                                .sort((a, b) => b.date.getTime() - a.date.getTime())
                                .map((event) => (
                                    <div
                                        key={event.id}
                                        className={`text-sm p-3 rounded-md border ${event.completed ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium capitalize">{event.type}</div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteEvent(event.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-gray-500" />
                                            </Button>
                                        </div>
                                        <div className="text-gray-500">{format(event.date, "PPP")}</div>
                                        {event.notes && (
                                            <div className="mt-1 text-gray-600">{event.notes}</div>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => handleToggleEventComplete(event.id)}
                                        >
                                            {event.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                        </Button>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                <Dialog open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Add Event for {job.companyName}</DialogTitle>
                        <EventForm
                            jobId={job.id}
                            onSubmit={handleAddEvent}
                            onCancel={() => setIsEventFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </CardContent>

            <CardFooter className="justify-end space-x-2">
                <Button variant="outline" onClick={() => onEdit(job)}>
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => onDelete(job.id)}
                >
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}