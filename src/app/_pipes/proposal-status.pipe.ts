import { Pipe, PipeTransform } from '@angular/core';
import { ProposalStatus } from '../_models/tender.types';

@Pipe({
  name: 'proposalStatus'
})
export class ProposalStatusPipe implements PipeTransform {
  transform(value: ProposalStatus | null | undefined): string {
    if (value == null) return 'Unknown Status';

    const statuses: Record<ProposalStatus, string> = {
      [ProposalStatus.Submitted]: 'Submitted',
      [ProposalStatus.Accepted]: 'Accepted',
      [ProposalStatus.Rejected]: 'Rejected'
    };

    return statuses[value] || 'Unknown';
  }
}
