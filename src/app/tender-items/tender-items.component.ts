import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonEngine } from '@angular/ssr/node';
import { ReturnMedicineDTO } from '../_models/medicine.types';
import { CreateTenderItem } from '../_models/tender.types';

@Component({
  selector: 'app-tender-items',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tender-items.component.html',
  styleUrl: './tender-items.component.css'
})
export class TenderItemsComponent {
  @Input() tenderId!: number;
  @Input() medicines: ReturnMedicineDTO[] = [];
  @Output() save = new EventEmitter<CreateTenderItem>();
  @Output() close = new EventEmitter<void>();

  tenderItemForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

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
