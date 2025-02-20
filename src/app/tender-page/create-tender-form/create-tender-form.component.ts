import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReturnTenderDTO, CreateTenderDTO } from '../../_models/tender.types';
import { CommonModule } from '@angular/common';
import { pastDateValidator, validDateValidator } from '../../_validators/validators';
import { ValidationErrorsComponent } from '../../validation-errors/validation-errors.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-tender-form',
  imports: [ReactiveFormsModule, CommonModule, ValidationErrorsComponent, MatIconModule],
  templateUrl: './create-tender-form.component.html',
  styleUrl: './create-tender-form.component.css'
})
export class CreateTenderFormComponent {
  @Input() tender: ReturnTenderDTO | null = null;
  @Output() save = new EventEmitter<CreateTenderDTO>();
  @Output() close = new EventEmitter<void>();

  tenderForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.tenderForm = this.fb.group({
      title: [this.tender?.title || '', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: [this.tender?.description || '', [Validators.required, Validators.minLength(5), Validators.maxLength(2000)]],
      deadlineDate: [this.tender?.deadlineDate || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], [Validators.required, pastDateValidator, validDateValidator]]
    });
  }

  submitForm(): void {
    if (this.tenderForm.invalid) return;
    this.save.emit(this.tenderForm.value);
  }
}
