import { ChangeDetectorRef, Component, computed, effect, HostListener, inject, input, Input, signal, SimpleChanges } from '@angular/core';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { MedicineService } from '../../_services/medicine.service';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

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
  private cdr = inject(ChangeDetectorRef);

  allMedicines = input<ReturnMedicineDTO[]>([]);

  isOpen = signal(false);
  considerRequests = signal(false);
  considerTenders = signal(false);
  medicinesNeedingTender = signal<ReturnMedicineDTO[]>([]);
  medicinesNeedingAudit = signal<ReturnMedicineDTO[]>([]);
  isLoading = signal(false);

  filtersChanged = computed(() => ({
    requests: this.considerRequests(),
    tenders: this.considerTenders(),
    medicines: this.allMedicines(),
  }));

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

    this.isLoading.set(true);

    this.medicineService.getMedicineStockForecast(
      this.considerRequests(),
      this.considerTenders()
    ).pipe(
      finalize(() => {
        this.isLoading.set(false);
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        const needingTender = data
          .filter(m => m.needsRestock)
          .map(m => m.medicine);
    
        this.medicinesNeedingTender.set(needingTender);
      },
      error: (error) => {
        console.error('Error fetching medicine stock forecast:', error);
        this.medicinesNeedingTender.set([]);
      }
    });
    
  }

  addDaysToDate(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  toggleConsiderRequests() {
    this.considerRequests.update(value => !value);
  }

  toggleConsiderTenders() {
    this.considerTenders.update(value => !value);
  }

  toggleNotifications() {
    this.isOpen.update(open => !open);
  }
}
