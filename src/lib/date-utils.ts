export function isValidDate(year: number, month: number, day: number): boolean {
    // Create a date object with the input
    const date = new Date(year, month - 1, day);
  
    return date.getFullYear() === year &&
           date.getMonth() === month - 1 &&
           date.getDate() === day;
  }
  
  export function getDaysInMonth(year: number, month: number): number {
    // month is 1-based here
    return new Date(year, month, 0).getDate();
  }
  
  export interface DateInputs {
    day: string;
    month: string;
    year: string;
  }
  
  export function getInitialDateInputs(date: Date): DateInputs {
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      year: date.getFullYear().toString()
    };
  }
  
  export function handleDateInputChange(
    field: 'day' | 'month' | 'year',
    value: string,
    currentInputs: DateInputs
  ): DateInputs {
    const numValue = value.replace(/\D/g, '');
    const newInputs = { ...currentInputs };
  
    switch (field) {
      case 'month':
        const monthNum = Math.min(Math.max(parseInt(numValue) || 1, 1), 12);
        newInputs.month = monthNum.toString().padStart(2, '0');
        break;
      case 'year':
        newInputs.year = numValue.slice(0, 4);
        break;
      case 'day':
        const year = parseInt(currentInputs.year) || new Date().getFullYear();
        const month = parseInt(currentInputs.month) || 1;
        const maxDays = getDaysInMonth(year, month);
        const dayNum = Math.min(Math.max(parseInt(numValue) || 1, 1), maxDays);
        newInputs.day = dayNum.toString().padStart(2, '0');
        break;
    }
  
    return newInputs;
  }