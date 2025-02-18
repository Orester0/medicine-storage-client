import { Pipe, PipeTransform } from '@angular/core';
import { RequestStatus } from '../_models/medicine-request.types';
import { TenderStatus } from '../_models/tender.types';

@Pipe({
  name: 'tenderStatus'
})
export class TenderStatusPipe implements PipeTransform {
  
  transform(value: TenderStatus | null | undefined): string {
    if (value == null) return 'Unknown Status';

    const statuses: Record<TenderStatus, string> = {
      [TenderStatus.Created]: 'Created',
      [TenderStatus.Published]: 'Published',
      [TenderStatus.Closed]: 'Closed',
      [TenderStatus.Awarded]: 'Awarded',
      [TenderStatus.Executing]: 'Executing',
      [TenderStatus.Executed]: 'Executed',
      [TenderStatus.Cancelled]: 'Cancelled'
    };

    return statuses[value] || 'Unknown';
  }
}
