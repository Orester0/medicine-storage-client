import { Component, Input, SimpleChanges } from '@angular/core';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';

@Component({
  selector: 'app-medicine-notifications',
  imports: [CommonModule, MatIconModule, MedicineNamePipe],
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
  @Input() allMedicines: ReturnMedicineDTO[] = [];
  
  isOpen = false;
  medicinesNeedingTender: ReturnMedicineDTO[] = [];
  medicinesNeedingAudit: ReturnMedicineDTO[] = [];
  hasIssues = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['allMedicines']) {
      this.checkMedicines();
    }
  }

  ngOnInit() {
    this.checkMedicines();
  }

  checkMedicines() {
    const currentDate = new Date();
  
    this.medicinesNeedingTender = this.allMedicines.filter(m => 
      m.stock < m.minimumStock
    );
  
    this.medicinesNeedingAudit = this.allMedicines.filter(m => 
      m.lastAuditDate != null && 
      this.addDaysToDate(new Date(m.lastAuditDate), m.auditFrequencyDays) <= currentDate
    );
  
    this.hasIssues = this.medicinesNeedingTender.length > 0 || 
                     this.medicinesNeedingAudit.length > 0;
  }

  addDaysToDate(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  toggleNotifications() {
    this.isOpen = !this.isOpen;
  }

}
