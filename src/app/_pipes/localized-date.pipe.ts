import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format: string = 'short'): string {
    if (!value) return 'N/A'; 

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new Date(value);

    if (isNaN(date.getTime())) return 'Invalid date';

    return new Intl.DateTimeFormat('default', {
      timeZone: userTimezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  }
}
