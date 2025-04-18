import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { MatIconModule } from '@angular/material/icon';
import { LocalizedDatePipe } from '../../_pipes/localized-date.pipe';
import { MatTooltip } from '@angular/material/tooltip';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { MedicineService } from '../../_services/medicine.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorsComponent } from '../../validation-errors/validation-errors.component';
import { dateRangeValidator } from '../../_validators/validators';

@Component({
  selector: 'app-medicines-details',
  imports: [CommonModule, MatIconModule, LocalizedDatePipe, MatTooltip, HasRoleDirective, ReactiveFormsModule, ValidationErrorsComponent],
  templateUrl: './medicines-details.component.html',
  styleUrl: './medicines-details.component.css'
})

export class MedicinesDetailsComponent {
  private medicineService = inject(MedicineService);

  @Input() medicine!: ReturnMedicineDTO;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<ReturnMedicineDTO>();
  @Output() onCreate = new EventEmitter<ReturnMedicineDTO>();
  @Output() onDelete = new EventEmitter<ReturnMedicineDTO>();

  showDateRangePicker = false;

  dateRangeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.dateRangeForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [this.getTodayDateString(), Validators.required],
    }, {
      validators: [dateRangeValidator]
    });
  }


  getTodayDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  openDateRangePicker() {
    this.dateRangeForm.reset({
      endDate: this.getTodayDateString()
    });
    this.showDateRangePicker = true;
  }
  
  reportStartDate!: string;
  reportEndDate!: string;
  
  onDownloadReport() {
    if (this.dateRangeForm.invalid) {
      this.dateRangeForm.markAllAsTouched();
      return;
    }
  
    const start = new Date(this.dateRangeForm.get('startDate')!.value);
    const end = new Date(this.dateRangeForm.get('endDate')!.value);
  
    this.downloadReport(this.medicine.id, start, end);
    this.showDateRangePicker = false;
  }
  


  downloadReport(medicineId: number, startDate: Date, endDate: Date): void {
    this.medicineService.downloadMedicineReport(medicineId, startDate, endDate)
      .subscribe(blob => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `medicine-report-${medicineId}-${startDate.toISOString().split('T')[0]}-${endDate.toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
  

  onCloseDetails() {
    this.onClose.emit();
  }

  onEditMedicine() {
    this.onEdit.emit(this.medicine);
  }

  onCreateRequest() {
    this.onCreate.emit(this.medicine);
  }

  onDeleteMedicine() {
    this.onDelete.emit(this.medicine);
  }

}
