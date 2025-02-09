import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ReturnMedicineDTO } from '../_models/medicine.types';
import { CreateMedicineRequestDTO } from '../_models/medicine-operations.types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-medicine-request-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-medicine-request-form.component.html',
  styleUrl: './create-medicine-request-form.component.css'
})
export class CreateMedicineRequestFormComponent implements OnInit{
  @Input() medicines: ReturnMedicineDTO[] = [];
  @Input() initialData: Partial<CreateMedicineRequestDTO> = {};
  @Input() preselectedMedicine: ReturnMedicineDTO | null = null;
  @Output() submitRequest = new EventEmitter<CreateMedicineRequestDTO>();
  @Output() cancelRequest = new EventEmitter<void>();

  requestForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      medicineId: [this.preselectedMedicine?.id || this.initialData.medicineId || 0, Validators.required],
      quantity: [this.initialData.quantity || 0, [Validators.required, Validators.min(1)]],
      requiredByDate: [this.initialData.requiredByDate || new Date().toISOString().split('T')[0], Validators.required],
      justification: [this.initialData.justification || '']
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
    this.cancelRequest.emit();
  }
}
