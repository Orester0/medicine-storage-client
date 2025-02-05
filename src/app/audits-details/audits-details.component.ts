import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuditStatus, ReturnAuditDTO } from '../_models/audit.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audits-details',
  imports: [CommonModule],
  templateUrl: './audits-details.component.html',
  styleUrl: './audits-details.component.css'
})
export class AuditsDetailsComponent {
  @Input() audit: ReturnAuditDTO | null = null;
  @Output() onAction = new EventEmitter<{ action: string; id: number }>();
  @Output() onClose = new EventEmitter<void>();

  closeDetails(): void {
    this.onClose.emit();
  }

  
  performAction(action: string): void {
    if (this.audit) {
      this.onAction.emit({ action, id: this.audit.id });
    }
  }


  getAuditStatusText(status: AuditStatus): string {
    const statusMap: Record<AuditStatus, string> = {
      [AuditStatus.Planned]: 'Planned',
      [AuditStatus.InProgress]: 'In Progress',
      [AuditStatus.Completed]: 'Completed',
      [AuditStatus.RequiresFollowUp]: 'Requires Follow-Up',
      [AuditStatus.Cancelled]: 'Cancelled',
    };
    return statusMap[status] ?? 'Unknown';
  }

  getAuditStatusBadgeClass(status: AuditStatus): string {
    const classMap: Record<AuditStatus, string> = {
      [AuditStatus.Planned]: 'bg-secondary',
      [AuditStatus.InProgress]: 'bg-primary',
      [AuditStatus.Completed]: 'bg-success',
      [AuditStatus.RequiresFollowUp]: 'bg-warning text-dark',
      [AuditStatus.Cancelled]: 'bg-danger',
    };
    return classMap[status] ?? 'bg-secondary';
  }
}