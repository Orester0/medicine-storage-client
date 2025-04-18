import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { CreateAuditDTO } from '../../_models/audit.types';
import { FormBuilder, FormGroup, MaxLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { pastDateValidator, validDateValidator } from '../../_validators/validators';
import { ValidationErrorsComponent } from '../../validation-errors/validation-errors.component';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-audit-form',
  imports: [ReactiveFormsModule, CommonModule, ValidationErrorsComponent, MedicineNamePipe, MatIconModule],
  templateUrl: './create-audit-form.component.html',
  styleUrl: './create-audit-form.component.css'
})
export class CreateAuditFormComponent implements OnInit{
  private fb = inject(FormBuilder);

  @Input() medicines: ReturnMedicineDTO[] = [];
  @Input() initialData: Partial<CreateAuditDTO> = {};
  @Output() submitRequest = new EventEmitter<CreateAuditDTO>();
  @Output() cancelRequest = new EventEmitter<void>();


  auditForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(){
    this.auditForm = this.fb.group({
      title: [this.initialData.title || '', [Validators.required, Validators.maxLength(200), Validators.minLength(5)]],
      plannedDate: [this.initialData.plannedDate || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], [Validators.required, validDateValidator, pastDateValidator]],
      medicineIds: [this.initialData.medicineIds || [], [Validators.required]],
      notes: [this.initialData.notes || '', [Validators.maxLength(500)]]
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
    this.auditForm.reset();
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
