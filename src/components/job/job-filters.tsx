'use client';

import { JobType, JobStatus } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface JobFiltersProps {
  typeFilter: JobType | 'all';
  statusFilter: JobStatus | 'all';
  onTypeChange: (value: JobType | 'all') => void;
  onStatusChange: (value: JobStatus | 'all') => void;
  onReset: () => void;
}

export function JobFilters({
  typeFilter,
  statusFilter,
  onTypeChange,
  onStatusChange,
  onReset,
}: JobFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      
      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Job Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="full-time">Full Time</SelectItem>
          <SelectItem value="part-time">Part Time</SelectItem>
          <SelectItem value="internship">Internship</SelectItem>
          <SelectItem value="freelance">Freelance</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="applied">Applied</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="offered">Offered</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="accepted">Accepted</SelectItem>
        </SelectContent>
      </Select>

      {(typeFilter !== 'all' || statusFilter !== 'all') && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}