import { Pipe, PipeTransform } from '@angular/core';
import { TenderItemStatus } from '../_models/tender.types';

@Pipe({
  name: 'tenderItemStatus'
})
export class TenderItemStatusPipe implements PipeTransform {
  transform(value: TenderItemStatus | null | undefined): string {
    if (value == null) return 'Unknown Status';

    const statuses: Record<TenderItemStatus, string> = {
      [TenderItemStatus.Pending]: 'Pending',
      [TenderItemStatus.Executed]: 'Executed'
    };

    return statuses[value] || 'Unknown';
  }
}
