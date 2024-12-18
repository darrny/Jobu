'use client';

import { useState } from 'react';
import { JobApplication } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Timestamp } from 'firebase/firestore';
import { DateInput } from "@/components/ui/date-input";
import { getInitialDateInputs, isValidDate, DateInputs } from "@/lib/date-utils";
import { toast } from '../ui/use-toast';

interface JobApplicationFormProps {
    onSubmit: (data: Partial<JobApplication>) => void;
    initialData?: Partial<JobApplication>;
}

export function JobApplicationForm({ onSubmit, initialData }: JobApplicationFormProps) {
    const initialDate = initialData?.dateApplied instanceof Timestamp
        ? initialData.dateApplied.toDate()
        : initialData?.dateApplied || new Date();

    const [formData, setFormData] = useState({
        companyName: initialData?.companyName || '',
        jobTitle: initialData?.jobTitle || '',
        applicationLink: initialData?.applicationLink || '',
        type: initialData?.type || 'full-time',
        status: initialData?.status || 'applied',
    });

    const [dateInputs, setDateInputs] = useState<DateInputs>(getInitialDateInputs(initialDate));


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const year = parseInt(dateInputs.year);
        const month = parseInt(dateInputs.month);
        const day = parseInt(dateInputs.day);

        if (!isValidDate(year, month, day)) {
            toast({
                title: "Invalid date",
                description: "Please enter a valid date",
                variant: "destructive"
            });
            return;
        }

        const dateApplied = new Date(year, month - 1, day);
        onSubmit({
            ...formData,
            dateApplied
        });
    };

    const handleDateChange = (field: 'day' | 'month' | 'year', value: string) => {
        // Only allow numbers and enforce limits
        const numValue = value.replace(/\D/g, '');

        let finalValue = numValue;
        if (field === 'day') {
            finalValue = Math.min(Math.max(parseInt(numValue) || 1, 1), 31).toString();
        } else if (field === 'month') {
            finalValue = Math.min(Math.max(parseInt(numValue) || 1, 1), 12).toString();
        } else if (field === 'year') {
            finalValue = numValue.slice(0, 4);
        }

        setDateInputs(prev => ({
            ...prev,
            [field]: finalValue
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="applicationLink">Application Link</Label>
                    <Input
                        id="applicationLink"
                        type="url"
                        value={formData.applicationLink}
                        onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <DateInput
                        dateInputs={dateInputs}
                        setDateInputs={setDateInputs}
                        label="Date Applied"
                    />
                </div>

                <div>
                    <Label>Job Type</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Status</Label>
                    <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="offered">Offered</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit">
                    {initialData ? 'Update Application' : 'Add Application'}
                </Button>
            </div>
        </form>
    );
}