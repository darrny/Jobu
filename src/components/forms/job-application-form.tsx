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
    type: initialData?.type || 'internship',
    status: initialData?.status || 'applied',
  });

  const [dateInputs, setDateInputs] = useState({
    day: initialDate.getDate().toString(),
    month: (initialDate.getMonth() + 1).toString(),
    year: initialDate.getFullYear().toString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple number parsing for dates
    const dateApplied = new Date(
      parseInt(dateInputs.year),
      parseInt(dateInputs.month) - 1, // Month is 0-based
      parseInt(dateInputs.day)
    );

    onSubmit({
      ...formData,
      dateApplied
    });
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
          <Label>Date Applied</Label>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="day" className="text-xs">Day (1-31)</Label>
                <Input
                  id="day"
                  value={dateInputs.day}
                  onChange={(e) => setDateInputs({ ...dateInputs, day: e.target.value.replace(/\D/g, '') })}
                  placeholder="DD"
                  maxLength={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="month" className="text-xs">Month (1-12)</Label>
                <Input
                  id="month"
                  value={dateInputs.month}
                  onChange={(e) => setDateInputs({ ...dateInputs, month: e.target.value.replace(/\D/g, '') })}
                  placeholder="MM"
                  maxLength={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="year" className="text-xs">Year</Label>
                <Input
                  id="year"
                  value={dateInputs.year}
                  onChange={(e) => setDateInputs({ ...dateInputs, year: e.target.value.replace(/\D/g, '') })}
                  placeholder="YYYY"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Please enter a valid date. Invalid dates may cause unexpected behavior.
            </p>
          </div>
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