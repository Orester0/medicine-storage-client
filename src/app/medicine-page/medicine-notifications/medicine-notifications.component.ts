import { ChangeDetectorRef, Component, computed, effect, input, signal } from '@angular/core';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medicine-notifications',
  imports: [CommonModule, MatIconModule, MedicineNamePipe, FormsModule],
  templateUrl: './medicine-notifications.component.html',
  styleUrl: './medicine-notifications.component.css',
  animations: [
    trigger('blink', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0.2 })), 
      transition('true <=> false', animate('1000ms ease-in-out')), 
    ]),
    trigger('togglePanel', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })), 
      state('*', style({ opacity: 1, transform: 'translateY(0)' })), 
      transition('void <=> *', animate('300ms ease-in-out')), 
    ]),
  ],
})
export class MedicineNotificationsComponent {
  allMedicines = input<ReturnMedicineDTO[]>([]);

  isOpen = signal(false);
  medicinesNeedingTender = signal<ReturnMedicineDTO[]>([]);
  medicinesNeedingAudit = signal<ReturnMedicineDTO[]>([]);
  isLoading = signal(false);

  hasIssues = computed(() =>
    this.medicinesNeedingTender().length > 0 ||
    this.medicinesNeedingAudit().length > 0
  );

  constructor() {
    effect(() => {
      this.updateMedicineData();
    });
  }

  updateMedicineData() {
    const currentDate = new Date();
  
    const needingAudit = this.allMedicines().filter(m =>
      m.lastAuditDate != null &&
      this.addDaysToDate(new Date(m.lastAuditDate), m.auditFrequencyDays) <= currentDate
    );
    this.medicinesNeedingAudit.set(needingAudit);
  
    const needingTender = this.allMedicines().filter(m =>
      m.stock != null && m.minimumStock != null && m.stock < m.minimumStock
    );

    this.medicinesNeedingTender.set(needingTender);
  }
  

  addDaysToDate(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  toggleNotifications() {
    this.isOpen.update(open => !open);
  }
}
