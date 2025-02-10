import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RequestStatus, ReturnMedicineRequestDTO } from '../../_models/medicine-operations.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medicine-operations-details',
  imports: [CommonModule],
  templateUrl: './medicine-operations-details.component.html',
  styleUrl: './medicine-operations-details.component.css'
})
export class MedicineOperationsDetailsComponent {
  @Input() medicineRequest: ReturnMedicineRequestDTO | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onAction = new EventEmitter<{ action: string; id: number }>();

  closeDetails(): void {
    this.onClose.emit();
  }


  performAction(action: string): void {
    if (this.medicineRequest) {
      this.onAction.emit({ action, id: this.medicineRequest.id });
    }
  }

  protected RequestStatus = RequestStatus;

  getStatusBadgeClass(status: RequestStatus): string {
    const classMap = {
      [RequestStatus.Pending]: 'bg-warning',
      [RequestStatus.PedingWithSpecial]: 'bg-info',
      [RequestStatus.Approved]: 'bg-success',
      [RequestStatus.Rejected]: 'bg-danger'
    };
    return classMap[status] || 'bg-secondary';
  }


  getStatusText(status: RequestStatus | undefined): string {
    if (status === undefined) {
      return 'Unknown';
    }
  
    const statusMap = {
      [RequestStatus.Pending]: 'Pending',
      [RequestStatus.PedingWithSpecial]: 'Pending With Special',
      [RequestStatus.Approved]: 'Approved',
      [RequestStatus.Rejected]: 'Rejected',
    };
    return statusMap[status] || 'Unknown';
  }
  
}
