import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { MedicineService } from '../../_services/medicine.service';
import { CommonModule } from '@angular/common';
import { ValidationErrorsComponent } from '../../validation-errors/validation-errors.component';
import { uniqueValidator } from '../../_validators/validators';

@Component({
  selector: 'app-create-medicine-form',
  imports: [ReactiveFormsModule, CommonModule, ValidationErrorsComponent],
  templateUrl: './create-medicine-form.component.html',
  styleUrl: './create-medicine-form.component.css'
})
export class CreateMedicineFormComponent implements OnInit{
  @Input() medicine: ReturnMedicineDTO | null = null;
  @Input() allMedicines!: ReturnMedicineDTO[];
  @Output() save = new EventEmitter<ReturnMedicineDTO>();
  @Output() close = new EventEmitter<void>();

  medicineForm!: FormGroup;
  modalTitle: string = 'Create Medicine';

  getMedicineNames(medicines: ReturnMedicineDTO[]): string[] {
    return medicines.map(medicine => medicine.name);
  } 

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.medicine) {
      this.modalTitle = 'Edit Medicine';
      this.patchFormValues();
    }
  }

  private initializeForm(): void {
    this.medicineForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), uniqueValidator(this.getMedicineNames(this.allMedicines))]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      category: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      requiresSpecialApproval: [false],
      minimumStock: [0, [Validators.required, Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)]],
      requiresStrictAudit: [false],
      auditFrequencyDays: [1, [Validators.required, Validators.min(1), Validators.max(365)]]
    });
  }

  private patchFormValues(): void {
    if (this.medicine) {
      this.medicineForm.patchValue({
        name: this.medicine.name,
        description: this.medicine.description,
        category: this.medicine.category,
        requiresSpecialApproval: this.medicine.requiresSpecialApproval,
        minimumStock: this.medicine.minimumStock,
        requiresStrictAudit: this.medicine.requiresStrictAudit,
        auditFrequencyDays: this.medicine.auditFrequencyDays
      });
    }
  }

  onSubmit(): void {
    if (this.medicineForm.valid) {
      const formValue = this.medicineForm.value;
      if (this.medicine) {
        formValue.id = this.medicine.id;
      }
      this.save.emit(formValue);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
