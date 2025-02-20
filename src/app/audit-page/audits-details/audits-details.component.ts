import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuditStatus, ReturnAuditDTO } from '../../_models/audit.types';
import { CommonModule } from '@angular/common';
import { LocalizedDatePipe } from '../../_pipes/localized-date.pipe';
import { UserFullNamePipe } from '../../_pipes/user-full-name.pipe';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { AuditStatusPipe } from '../../_pipes/audit-status.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-audits-details',
  imports: [CommonModule, LocalizedDatePipe, UserFullNamePipe, MedicineNamePipe, AuditStatusPipe, MatIconModule],
  templateUrl: './audits-details.component.html',
  styleUrl: './audits-details.component.css'
})
export class AuditsDetailsComponent {
  @Input() audit!: ReturnAuditDTO;
  @Output() onClose = new EventEmitter<void>();
  @Output() onUpdate = new EventEmitter<ReturnAuditDTO>();
  @Output() onDelete = new EventEmitter<ReturnAuditDTO>();
  @Output() onStartAudit = new EventEmitter<ReturnAuditDTO>();
  @Output() onCloseAudit = new EventEmitter<ReturnAuditDTO>();

  closeDetails(): void {
    this.onClose.emit();
  }
  updateAudit(): void {
    this.onUpdate.emit(this.audit);
  }
  deleteAudit(): void {
    this.onDelete.emit(this.audit);
  }
  startAudit(): void {
    this.onStartAudit.emit(this.audit);
  }
  closeAudit(): void {
    this.onCloseAudit.emit(this.audit);
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
  getAuditStatusIcon(status: AuditStatus): string {
    const iconMap: Record<AuditStatus, string> = {
      [AuditStatus.Planned]: 'event_note', 
      [AuditStatus.InProgress]: 'play_arrow', 
      [AuditStatus.Completed]: 'check_circle', 
      [AuditStatus.RequiresFollowUp]: 'warning',
      [AuditStatus.Cancelled]: 'cancel',
    };
    return iconMap[status] ?? 'help'; 
  }
  
}