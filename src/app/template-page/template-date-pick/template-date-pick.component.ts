import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { TemplateType } from '../../_models/template.types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { pastDateValidator, validDateValidator } from '../../_validators/validators';
import { ValidationErrorsComponent } from '../../validation-errors/validation-errors.component';

@Component({
  selector: 'app-notification-template-date-pick',
  imports: [ReactiveFormsModule, ValidationErrorsComponent],
  templateUrl: './template-date-pick.component.html',
  styleUrl: './template-date-pick.component.css'
})
export class TemplateDatePickComponent implements OnInit{
  private fb = inject(FormBuilder);

  @Input() templateType!: TemplateType;
  @Output() confirmed = new EventEmitter<Date>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(){
    this.form = this.fb.group({
      date: [new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], [Validators.required, pastDateValidator, validDateValidator]]
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
