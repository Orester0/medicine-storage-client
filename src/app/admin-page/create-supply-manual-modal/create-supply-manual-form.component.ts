import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserFullNamePipe } from '../../_pipes/user-full-name.pipe';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';

@Component({
  selector: 'app-create-supply-manual-form',
  imports: [ReactiveFormsModule, CommonModule, MedicineNamePipe],
  templateUrl: './create-supply-manual-form.component.html',
  styleUrl: './create-supply-manual-form.component.css'
})
export class CreateSupplyManualFormComponent {
  @Input() medicines: ReturnMedicineDTO[] = [];
  @Output() submit = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  supplyForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(){
    this.supplyForm = this.fb.group({
      medicineId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.supplyForm.valid) {
      const formValue = this.supplyForm.value;
      const supply = {
        medicineId: formValue.medicineId,
        quantity: formValue.quantity
      };
      this.submit.emit(supply);
    }
  }

  onClose() {
    this.close.emit();
  }
}
