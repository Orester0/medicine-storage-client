import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RequestStatus, ReturnMedicineRequestDTO } from '../../_models/medicine-operations.types';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { UserFullNamePipe } from '../../_pipes/user-full-name.pipe';
import { LocalizedDatePipe } from '../../_pipes/localized-date.pipe';
import { RequestStatusPipe } from '../../_pipes/request-status.pipe';

@Component({
  selector: 'app-medicine-operations-details',
  imports: [CommonModule, MatIconModule, MedicineNamePipe, UserFullNamePipe, LocalizedDatePipe, RequestStatusPipe],
  templateUrl: './medicine-request-details.component.html',
  styleUrl: './medicine-request-details.component.css'
})
export class MedicineOperationsDetailsComponent {
  @Input() medicineRequest!: ReturnMedicineRequestDTO;
  @Output() onClose = new EventEmitter<void>();
  @Output() onApprove = new EventEmitter<number>();
  @Output() onReject = new EventEmitter<number>();

  RequestStatus = RequestStatus;

  getStatusBadgeClass(status: RequestStatus): string {
    const classes = {
      [RequestStatus.Pending]: 'bg-warning text-dark',
      [RequestStatus.PedingWithSpecial]: 'bg-info text-dark',
      [RequestStatus.Approved]: 'bg-success',
      [RequestStatus.Rejected]: 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
  }

  getStatusIcon(status: RequestStatus): string {
    const icons = {
      [RequestStatus.Pending]: 'hourglass_empty',
      [RequestStatus.PedingWithSpecial]: 'priority_high',
      [RequestStatus.Approved]: 'check_circle',
      [RequestStatus.Rejected]: 'cancel'
    };
    return icons[status] || 'help';
  }

  performAction(action: 'approve' | 'reject'): void {
    if (!this.medicineRequest) return;
    
    if (action === 'approve') {
      this.onApprove.emit(this.medicineRequest.id);
    } else {
      this.onReject.emit(this.medicineRequest.id);
    }
  }

  closeDetails(): void {
    this.onClose.emit();
  }
}
