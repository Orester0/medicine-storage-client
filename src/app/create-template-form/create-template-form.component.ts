import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';
import { ReturnMedicineDTO } from '../_models/medicine.types';
import { TemplateType, Template } from '../_models/template.types';

@Component({
  selector: 'app-create-template-form',
  imports: [ReactiveFormsModule, CommonModule, ValidationErrorsComponent],
  templateUrl: './create-template-form.component.html',
  styleUrl: './create-template-form.component.css'
})
export class CreateTemplateFormComponent {
  @Input() activeTab!: TemplateType;
  @Input() isEditMode!: boolean;
  @Input() selectedTemplate!: Template | null;
  @Input() medicines: ReturnMedicineDTO[] = [];
  @Input() showModal = false;

  @Output() submitForm = new EventEmitter<Template>();
  @Output() cancel = new EventEmitter<void>();

  auditForm!: FormGroup;
  medicineRequestForm!: FormGroup;
  tenderForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTemplate'] && this.selectedTemplate) {
      this.patchForm();
    }
  }

  private initializeForms(): void {
    this.auditForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200), Validators.minLength(5)]],
      recurrenceInterval: [1, [Validators.required, Validators.min(1)]],
      medicineIds: [[], Validators.required],
      notes: ['', [Validators.maxLength(500), Validators.minLength(3)]],
    });
  
    this.medicineRequestForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200), Validators.minLength(5)]],
      recurrenceInterval: [1, [Validators.required, Validators.min(1)]],
      medicineId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      justification: ['', Validators.maxLength(500)],
    });
  
    this.tenderForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200), Validators.minLength(5)]],
      recurrenceInterval: [1, [Validators.required, Validators.min(1)]],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.maxLength(1000)],
    });
  }

  private patchForm(): void {
    if (!this.selectedTemplate) return;
  
    const createDTO = this.selectedTemplate.createDTO;
  
    if (this.activeTab === 'audit' && 'medicineIds' in createDTO) {
      this.auditForm.patchValue({
        name: this.selectedTemplate.name,
        recurrenceInterval: this.selectedTemplate.recurrenceInterval,
        medicineIds: createDTO.medicineIds || [],
        notes: createDTO.notes || '',
      });
    } 
    else if (this.activeTab === 'medicine-request' && 'medicineId' in createDTO) {
      this.medicineRequestForm.patchValue({
        name: this.selectedTemplate.name,
        recurrenceInterval: this.selectedTemplate.recurrenceInterval,
        medicineId: createDTO.medicineId || null,
        quantity: createDTO.quantity || 1,
        justification: createDTO.justification || '',
      });
    } 
    else if (this.activeTab === 'tender' && 'title' in createDTO) {
      this.tenderForm.patchValue({
        name: this.selectedTemplate.name,
        recurrenceInterval: this.selectedTemplate.recurrenceInterval,
        title: createDTO.title || '',
        description: createDTO.description || '',
      });
    }
  }


  getActiveForm(): FormGroup {
    switch (this.activeTab) {
      case 'audit': return this.auditForm;
      case 'medicine-request': return this.medicineRequestForm;
      case 'tender': return this.tenderForm;
      default: throw new Error('Unknown template type');
    }
  }

  onSubmit(): void {
    if (this.getActiveForm().valid) {
      this.submitForm.emit(this.getActiveForm().value);
    }
  }
}
