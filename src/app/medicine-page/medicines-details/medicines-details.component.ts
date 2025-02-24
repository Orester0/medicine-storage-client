import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { MatIconModule } from '@angular/material/icon';
import { LocalizedDatePipe } from '../../_pipes/localized-date.pipe';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-medicines-details',
  imports: [CommonModule, MatIconModule, LocalizedDatePipe, MatTooltip],
  templateUrl: './medicines-details.component.html',
  styleUrl: './medicines-details.component.css'
})

export class MedicinesDetailsComponent {
  @Input() medicine!: ReturnMedicineDTO;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<ReturnMedicineDTO>();
  @Output() onCreate = new EventEmitter<ReturnMedicineDTO>();
  @Output() onDelete = new EventEmitter<ReturnMedicineDTO>();


  
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
