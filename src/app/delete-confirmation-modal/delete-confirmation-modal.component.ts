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
  @Input() isOpen: boolean = false; // Відкрито чи закрито модальне вікно
  @Input() name?: string; // Ім'я ліків, які потрібно видалити
  @Output() confirm = new EventEmitter<void>(); // Подія підтвердження
  @Output() cancel = new EventEmitter<void>(); // Подія скасування

  deleteConfirmationName: string = ''; // Ім'я, введене користувачем
  deleteError: string = ''; // Повідомлення про помилку

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
