import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReturnTenderDTO, CreateTenderDTO } from '../_models/tender.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-tender-form',
  imports: [ReactiveFormsModule, CommonModule],
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
      title: [this.tender?.title || '', Validators.required],
      description: [this.tender?.description || ''],
      deadlineDate: [this.tender?.deadlineDate || new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  submitForm(): void {
    if (this.tenderForm.invalid) return;
    this.save.emit(this.tenderForm.value);
  }
}
