'use client';

import { JobEvent } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MessagesSquare,
  PenTool,
  Trash2
} from 'lucide-react';

interface JobTimelineProps {
  events: JobEvent[];
  onToggleComplete: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

const eventTypeIcons = {
  interview: <MessagesSquare className="h-4 w-4" />,
  assessment: <PenTool className="h-4 w-4" />,
  'follow-up': <Clock className="h-4 w-4" />,
  other: <FileText className="h-4 w-4" />
};

export function JobTimeline({ events, onToggleComplete, onDeleteEvent }: JobTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <CalendarDays className="h-5 w-5" />
        Timeline
      </h3>

      {sortedEvents.length === 0 ? (
        <p className="text-sm text-gray-500">No events added yet.</p>
      ) : (
        <div className="space-y-3">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className={`relative flex items-start gap-4 rounded-lg border p-4 ${
                event.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={event.completed}
                  onCheckedChange={() => onToggleComplete(event.id)}
                />
                <div className={`${event.completed ? 'text-gray-500' : ''}`}>
                  <div className="flex items-center gap-2">
                    {eventTypeIcons[event.type]}
                    <span className="font-medium capitalize">
                      {event.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {format(event.date, 'PPP')}
                  </div>
                  {event.notes && (
                    <p className="text-sm mt-2">{event.notes}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => onDeleteEvent(event.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}