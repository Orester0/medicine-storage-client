import { Pipe, PipeTransform } from '@angular/core';
import { RequestStatus } from '../_models/medicine-request.types';

@Pipe({
  name: 'requestStatus'
})
export class RequestStatusPipe implements PipeTransform {
  transform(value: RequestStatus | null | undefined): string {
    if (value == null) return 'Unknown Status';

    const statuses: Record<RequestStatus, string> = {
      [RequestStatus.Pending]: 'Pending',
      [RequestStatus.PedingWithSpecial]: 'Pending with Special Approval',
      [RequestStatus.Approved]: 'Approved',
      [RequestStatus.Rejected]: 'Rejected'
    };

    return statuses[value] || 'Unknown';
  }
}
