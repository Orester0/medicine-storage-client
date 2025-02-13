import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CreateAuditDTO } from '../../_models/audit.types';
import { FormBuilder, FormGroup, MaxLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { pastDateValidator, validDateValidator } from '../../_validators/validators';
import { ValidationErrorsComponent } from '../../validation-errors/validation-errors.component';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';

@Component({
  selector: 'app-create-audit-form',
  imports: [ReactiveFormsModule, CommonModule, ValidationErrorsComponent, MedicineNamePipe],
  templateUrl: './create-audit-form.component.html',
  styleUrl: './create-audit-form.component.css'
})
export class CreateAuditFormComponent implements OnInit{
  @Input() medicines: ReturnMedicineDTO[] = [];
  @Input() initialData: Partial<CreateAuditDTO> = {};
  @Output() submitRequest = new EventEmitter<CreateAuditDTO>();
  @Output() cancelRequest = new EventEmitter<void>();

  auditForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(){
    this.auditForm = this.fb.group({
      plannedDate: [this.initialData.plannedDate || new Date().toISOString().split('T')[0], [Validators.required, validDateValidator, pastDateValidator]],
      medicineIds: [this.initialData.medicineIds || [], [Validators.required]],
      notes: [this.initialData.notes || '', [Validators.required, Validators.maxLength(500)]]
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.onCancel();
  }

  onSubmit(): void {
    if (this.auditForm.valid) {
      this.submitRequest.emit(this.auditForm.value);
    }
  }

  onCancel(): void {
    this.cancelRequest.emit();
  }

  toggleMedicine(id: number): void {
    const selectedMedicines = this.auditForm.get('medicineIds')!.value as number[];
    const index = selectedMedicines.indexOf(id);
  
    if (index === -1) {
      selectedMedicines.push(id);
    } else {
      selectedMedicines.splice(index, 1);
    }
  
    this.auditForm.get('medicineIds')!.setValue([...selectedMedicines]);
  }
  
  selectAllMedicines(): void {
    const allMedicineIds = this.medicines.map(m => m.id);
    this.auditForm.get('medicineIds')!.setValue(
      this.auditForm.get('medicineIds')!.value.length === allMedicineIds.length ? [] : allMedicineIds
    );
  }  
}
