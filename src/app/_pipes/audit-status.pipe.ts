import { Pipe, PipeTransform } from '@angular/core';
import { AuditStatus } from '../_models/audit.types';

@Pipe({
  name: 'auditStatus'
})
export class AuditStatusPipe implements PipeTransform {
  transform(value: AuditStatus | null | undefined): string {
    if (value == null) return 'Unknown Status';
    
    const statuses: Record<AuditStatus, string> = {
      [AuditStatus.Planned]: 'Planned',
      [AuditStatus.InProgress]: 'In Progress',
      [AuditStatus.SuccesfullyCompleted]: 'Completed',
      [AuditStatus.CompletedWithProblems]: 'Has Problems',
      [AuditStatus.Cancelled]: 'Cancelled'
    };

    return statuses[value] || 'Unknown';
  }
}
