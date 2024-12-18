'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { JobEvent } from '@/types';
import { DateInput } from "@/components/ui/date-input";
import { getInitialDateInputs, isValidDate, DateInputs } from "@/lib/date-utils";
import { toast } from '../ui/use-toast';

interface EventFormProps {
    jobId: string;
    onSubmit: (event: Omit<JobEvent, 'id'>) => void;
    onCancel: () => void;
}

export function EventForm({ jobId, onSubmit, onCancel }: EventFormProps) {
    const [type, setType] = useState<'interview' | 'assessment' | 'follow-up' | 'other'>('interview');
    const [notes, setNotes] = useState('');
    const [dateInputs, setDateInputs] = useState<DateInputs>(getInitialDateInputs(new Date()));

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

        onSubmit({
            type,
            date: new Date(year, month - 1, day),
            notes,
            completed: false
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Event Type</Label>
                <Select
                    value={type}
                    onValueChange={(value: typeof type) => setType(value)}
                >
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
                <DateInput
                    dateInputs={dateInputs}
                    setDateInputs={setDateInputs}
                    label="Event Date"
                />
            </div>

            <div>
                <Label>Notes</Label>
                <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes..."
                    className="h-24"
                />
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Add Event</Button>
            </div>
        </form>
    );
}