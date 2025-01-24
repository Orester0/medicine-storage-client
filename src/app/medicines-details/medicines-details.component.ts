import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-medicines-details',
  imports: [CommonModule],
  templateUrl: './medicines-details.component.html',
  styleUrl: './medicines-details.component.css'
})

export class MedicinesDetailsComponent {
  @Input() medicine: any;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();

  closeDetails() {
    this.onClose.emit();
  }

  editMedicine() {
    this.onEdit.emit(this.medicine);
  }
}
