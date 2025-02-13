import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReturnAuditItemDTO, UpdateAuditItemsRequest } from '../../_models/audit.types';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';

@Component({
  selector: 'app-audit-update-items',
  imports: [ReactiveFormsModule, CommonModule, MedicineNamePipe],
  templateUrl: './audit-update-items.component.html',
  styleUrl: './audit-update-items.component.css'
})
export class AuditUpdateItemsComponent {
  @Input() title: string = 'Update Audit Items';
  @Input() auditItems: ReturnAuditItemDTO[] = [];
  @Input() showQuantities: boolean = true;

  @Output() submit = new EventEmitter<UpdateAuditItemsRequest>(); 
  @Output() cancel = new EventEmitter<void>(); 

  auditForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.auditForm = this.fb.group({
      notes: [''],
    });

    this.auditItems.forEach((item) => {
      if (item.checkedByUser === null) {
        this.auditForm.addControl(
          item.id.toString(),
          this.fb.control(item.actualQuantity, [Validators.required, Validators.min(0)])
        );
      }
    });
  }

  onSubmit() {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.auditForm.invalid) {
      return;
    }

    const formValue = this.auditForm.value;
    const actualQuantities: { [key: number]: number } = {};

    this.auditItems.forEach((item) => {
      if (item.checkedByUser === null) {
        actualQuantities[item.medicine.id] = formValue[item.id.toString()];
      }
    });

    const request: UpdateAuditItemsRequest = {
      actualQuantities,
      notes: formValue.notes,
    };

    this.submit.emit(request);
  }

  onCancel() {
    this.cancel.emit();
  }
}
