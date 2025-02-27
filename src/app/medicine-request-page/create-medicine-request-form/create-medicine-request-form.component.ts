import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { CreateMedicineRequestDTO } from '../../_models/medicine-request.types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { pastDateValidator, validDateValidator } from '../../_validators/validators';
import { ValidationErrorsComponent } from '../../validation-errors/validation-errors.component';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-medicine-request-form',
  imports: [ReactiveFormsModule, CommonModule, ValidationErrorsComponent, MedicineNamePipe, MatIconModule],
  templateUrl: './create-medicine-request-form.component.html',
  styleUrl: './create-medicine-request-form.component.css'
})
export class CreateMedicineRequestFormComponent implements OnInit{
  private fb = inject(FormBuilder);

  @Input() medicines: ReturnMedicineDTO[] = [];
  @Input() initialData: Partial<CreateMedicineRequestDTO> = {};
  @Input() preselectedMedicine: ReturnMedicineDTO | null = null;
  @Output() submitRequest = new EventEmitter<CreateMedicineRequestDTO>();
  @Output() cancelRequest = new EventEmitter<void>();

  requestForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preselectedMedicine'] && !changes['preselectedMedicine'].firstChange) {
      this.requestForm.patchValue({
        medicineId: this.preselectedMedicine?.id || 0
      });
    }
    if (changes['isOpen'] && !changes['isOpen'].firstChange) {
      this.resetForm(); 
    }
  }

  private resetForm() {
    this.requestForm.reset({
      medicineId: this.initialData.medicineId || 0,
      quantity: this.initialData.quantity || 1,
      requiredByDate: this.initialData.requiredByDate || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      justification: this.initialData.justification || ''
    });
  }

  private initializeForm(){
    this.requestForm = this.fb.group({
      medicineId: [this.preselectedMedicine?.id || this.initialData.medicineId || 0, [Validators.required]],
      quantity: [this.initialData.quantity || 1, [Validators.required, Validators.min(1), Validators.max(Number.MAX_SAFE_INTEGER)]],
      requiredByDate: [this.initialData.requiredByDate || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], [Validators.required, pastDateValidator, validDateValidator]],
      justification: [this.initialData.justification || '', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    
    this.onCancel();
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.submitRequest.emit(this.requestForm.value);
    }
  }

  onCancel(): void {
    // this.requestForm.
    this.cancelRequest.emit();
  }
}
