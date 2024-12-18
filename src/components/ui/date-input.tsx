import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateInputs, handleDateInputChange } from "@/lib/date-utils";

interface DateInputProps {
  dateInputs: DateInputs;
  setDateInputs: (inputs: DateInputs) => void;
  label?: string;
}

export function DateInput({ dateInputs, setDateInputs, label = "Date" }: DateInputProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="day" className="text-xs">Day</Label>
          <Input
            id="day"
            value={dateInputs.day}
            onChange={(e) => setDateInputs(handleDateInputChange('day', e.target.value, dateInputs))}
            placeholder="DD"
            maxLength={2}
            required
          />
        </div>
        <div>
          <Label htmlFor="month" className="text-xs">Month</Label>
          <Input
            id="month"
            value={dateInputs.month}
            onChange={(e) => setDateInputs(handleDateInputChange('month', e.target.value, dateInputs))}
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
            onChange={(e) => setDateInputs(handleDateInputChange('year', e.target.value, dateInputs))}
            placeholder="YYYY"
            maxLength={4}
            required
          />
        </div>
      </div>
    </div>
  );
}