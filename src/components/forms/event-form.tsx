'use client';

import { useState } from 'react';
import { JobEvent } from '@/types';
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
import { Textarea } from '@/components/ui/textarea';

interface EventFormProps {
  jobId: string;
  onSubmit: (event: Omit<JobEvent, 'id'>) => void;
  onCancel: () => void;
}

export function EventForm({ jobId, onSubmit, onCancel }: EventFormProps) {
  const [type, setType] = useState<'interview' | 'assessment' | 'follow-up' | 'other'>('interview');
  const [notes, setNotes] = useState('');
  const [dateInputs, setDateInputs] = useState({
    day: new Date().getDate().toString(),
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear().toString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const date = new Date(
      parseInt(dateInputs.year),
      parseInt(dateInputs.month) - 1,
      parseInt(dateInputs.day)
    );

    onSubmit({
      type,
      date,
      notes,
      completed: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Event Type</Label>
        <Select value={type} onValueChange={(value: typeof type) => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="assessment">Assessment</SelectItem>
            <SelectItem value="follow-up">Follow-up</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Event Date</Label>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="event-day" className="text-xs">Day (1-31)</Label>
              <Input
                id="event-day"
                value={dateInputs.day}
                onChange={(e) => setDateInputs({ ...dateInputs, day: e.target.value.replace(/\D/g, '') })}
                placeholder="DD"
                maxLength={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="event-month" className="text-xs">Month (1-12)</Label>
              <Input
                id="event-month"
                value={dateInputs.month}
                onChange={(e) => setDateInputs({ ...dateInputs, month: e.target.value.replace(/\D/g, '') })}
                placeholder="MM"
                maxLength={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="event-year" className="text-xs">Year</Label>
              <Input
                id="event-year"
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
        <Label>Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes..."
          className="resize-none h-24"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Event
        </Button>
      </div>
    </form>
  );
}