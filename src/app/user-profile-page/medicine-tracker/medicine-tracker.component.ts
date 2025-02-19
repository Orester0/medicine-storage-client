import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map } from 'rxjs/internal/operators/map';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MedicineUsageService } from '../../_services/medicine-usage.service';
import { RequestStatus } from '../../_models/medicine-request.types';
import { AccountService } from '../../_services/account.service';
import { CreateMedicineUsageDTO } from '../../_models/medicine-usage.types';

interface MedicineCount {
  medicineId: number;
  medicineName: string;
  remainingQuantity: number;
}

@Component({
  selector: 'app-medicine-tracker',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medicine-tracker.component.html',
  styleUrl: './medicine-tracker.component.css'
})
export class MedicineTrackerComponent {
  private accountService = inject(AccountService);
  private usageService = inject(MedicineUsageService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  medicineList = signal<MedicineCount[]>([]);
  selectedMedicine = signal<MedicineCount | null>(null);
  showUsageModal = signal(false);
  
  usageForm: FormGroup = this.fb.group({
    quantity: [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.loadMedicineData();
  }

  openUsageForm(medicine: MedicineCount) {
    this.selectedMedicine.set(medicine);
    this.usageForm.get('quantity')?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(medicine.remainingQuantity)
    ]);
    this.usageForm.updateValueAndValidity();
    this.showUsageModal.set(true);
  }

  closeUsageForm() {
    this.showUsageModal.set(false);
    this.selectedMedicine.set(null);
    this.usageForm.reset({
      quantity: 1
    });
  }

  submitUsage() {
    if (this.usageForm.valid && this.selectedMedicine()) {
      const usage: CreateMedicineUsageDTO = {
        medicineId: this.selectedMedicine()!.medicineId,
        quantity: this.usageForm.value.quantity
      };

      this.usageService.createUsage(usage).subscribe({
        next: () => {
          this.toastr.success('Usage recorded successfully');
          this.closeUsageForm();
          this.loadMedicineData();
        },
        error: () => {
          this.toastr.error('Error recording usage');
        }
      });
    }
  }

  private loadMedicineData() {
    forkJoin({
      requests: this.accountService.getRequestsRequested(),
      usages: this.accountService.getUsagesCreated()
    }).pipe(
      map(({ requests, usages }) => {
        const approvedRequests = requests.filter(r => r.status === RequestStatus.Approved);
        const medicineMap = new Map<number, MedicineCount>();
        
        approvedRequests.forEach(request => {
          if (!medicineMap.has(request.medicine.id)) {
            medicineMap.set(request.medicine.id, {
              medicineId: request.medicine.id,
              medicineName: request.medicine.name,
              remainingQuantity: request.quantity
            });
          } else {
            const existing = medicineMap.get(request.medicine.id)!;
            existing.remainingQuantity += request.quantity;
          }
        });
        
        usages.forEach(usage => {
          if (medicineMap.has(usage.medicine.id)) {
            const medicine = medicineMap.get(usage.medicine.id)!;
            medicine.remainingQuantity -= usage.quantity;
          }
        });
        
        return Array.from(medicineMap.values())
          .filter(m => m.remainingQuantity > 0);
      })
    ).subscribe({
      next: (medicines) => this.medicineList.set(medicines)
    });
  }
}
