import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-confirmation-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.css'
})
export class DeleteConfirmationModalComponent {
  @Input() isOpen: boolean = false;
  @Input() name?: string;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  deleteConfirmationName: string = '';
  deleteError: string = '';

  close() {
    this.cancel.emit();
    this.deleteConfirmationName = '';
    this.deleteError = '';
  }

  confirmDelete() {
    if (this.deleteConfirmationName === this.name) {
      this.confirm.emit();
    } else {
      this.deleteError = 'Entered name does not match.';
    }
  }
}
