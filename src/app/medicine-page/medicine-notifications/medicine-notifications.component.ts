import { ChangeDetectorRef, Component, computed, effect, inject, input, signal } from '@angular/core';
import { ReturnMedicineDTO, ReturnMedicineShortDTO } from '../../_models/medicine.types';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { FormsModule } from '@angular/forms';
import { MedicineService } from '../../_services/medicine.service';

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
  private medicineService = inject(MedicineService);

  isOpen = signal(false);
  medicinesNeedingTender = signal<ReturnMedicineShortDTO[]>([]);
  medicinesNeedingAudit = signal<ReturnMedicineShortDTO[]>([]);
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
    this.medicineService.getProblematicMedicines().subscribe(data => {
      this.medicinesNeedingAudit.set(data.medicinesNeedingAudit);
      this.medicinesNeedingTender.set(data.medicinesNeedingTender);
    });
  }
  
  toggleNotifications() {
    this.isOpen.update(open => !open);
  }
}
