import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { CreateTenderItem } from '../../_models/tender.types';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tender-items',
  imports: [ReactiveFormsModule, CommonModule, MedicineNamePipe, MatIconModule],
  templateUrl: './tender-items.component.html',
  styleUrl: './tender-items.component.css'
})
export class TenderItemsComponent {
  private fb = inject(FormBuilder);

  @Input() tenderId!: number;
  @Input() medicines: ReturnMedicineDTO[] = [];
  @Output() save = new EventEmitter<CreateTenderItem>();
  @Output() close = new EventEmitter<void>();

  tenderItemForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.tenderItemForm = this.fb.group({
      medicineId: ['', Validators.required],
      requiredQuantity: [0, [Validators.required, Validators.min(1)]]
    });
  }

  submitForm(): void {
    if (this.tenderItemForm.invalid) return;
    this.save.emit({ ...this.tenderItemForm.value, tenderId: this.tenderId });
  }
}
