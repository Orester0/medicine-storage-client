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
    trigger('togglePanel', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ]),
    trigger('blink', [
      state('true', style({ backgroundColor: '#ffc107' })), 
      state('false', style({ backgroundColor: '#ffffff' })),
      transition('false <=> true', animate('300ms ease-in-out'))
    ])
  ]
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

  onCreateTender(medicine: ReturnMedicineDTO) {
    console.log('ZXC', medicine);
  }

  onCreateAudit(medicine: ReturnMedicineDTO) {
    console.log('ZXC', medicine);
  }
}
