import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TemplateType } from '../_models/template.types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { futureDateValidator, validDateValidator } from '../_validators/validators';

@Component({
  selector: 'app-notification-template-date-pick',
  imports: [ReactiveFormsModule],
  templateUrl: './template-date-pick.component.html',
  styleUrl: './template-date-pick.component.css'
})
export class TemplateDatePickComponent {
  @Input() templateType!: TemplateType;
  @Output() confirmed = new EventEmitter<Date>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      date: [new Date().toISOString().split('T')[0], [Validators.required, futureDateValidator, validDateValidator]]
    });
  }

  getTitle(): string {
    switch (this.templateType) {
      case 'medicine-request': return 'Set Required By Date';
      case 'audit': return 'Set Planned Date';
      case 'tender': return 'Set Deadline Date';
      default: return 'Set Date';
    }
  }

  getLabel(): string {
    switch (this.templateType) {
      case 'medicine-request': return 'Required By Date';
      case 'audit': return 'Planned Date';
      case 'tender': return 'Deadline Date';
      default: return 'Date';
    }
  }

  confirm(): void {
    if (this.form.valid) {
      this.confirmed.emit(new Date(this.form.get('date')?.value));
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
