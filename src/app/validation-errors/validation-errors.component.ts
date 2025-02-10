import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-validation-errors',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './validation-errors.component.html',
  styleUrl: './validation-errors.component.css'
})
export class ValidationErrorsComponent {
  @Input() control!: AbstractControl;
  
  get errors(): ValidationErrors | null {
    return this.control?.errors ?? null;
  }

  get shouldShowErrors(): boolean {
    return !!this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }
}
