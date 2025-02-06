import { Component } from '@angular/core';
import { ReturnMedicineDTO } from '../_models/medicine.types';
import { AuditTemplateDTO, MedicineRequestTemplateDTO, TenderTemplateDTO, Template, TemplateType, NotificationTemplateBaseDTO, CreateAuditTemplate, CreateMedicineRequestTemplate, CreateTenderTemplate } from '../_models/notification-template.types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationTemplateService } from '../_services/notification-template.service';
import { MedicineService } from '../_services/medicine.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotificationTemplateDatePickComponent } from '../notification-template-date-pick/notification-template-date-pick.component';

@Component({
  selector: 'app-notification-template',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, NotificationTemplateDatePickComponent],
  templateUrl: './notification-template.component.html',
  styleUrl: './notification-template.component.css'
})
export class NotificationTemplateComponent {
  // NOTIFICATIONS
  hasNotifications = false;
  templatesNeedingExecution: Record<string, boolean> = {};
  tabsNeedingExecution: Record<TemplateType, boolean> = {
    'medicine-request': false,
    'audit': false,
    'tender': false
  };
  

  checkNotifications(): void {
    const today = new Date();
    this.hasNotifications = false;
    this.templatesNeedingExecution = {};
    this.tabsNeedingExecution = { 'medicine-request': false, 'audit': false, 'tender': false };
  
    const checkTemplate = (template: Template) => {
      if (!template.isActive || !template.lastExecutedDate) return false;
      const lastExec = new Date(template.lastExecutedDate);
      const nextExec = new Date(lastExec.setDate(lastExec.getDate() + template.recurrenceInterval));
      return nextExec <= today;
    };
  
    const updateTabStatus = (template: Template, tab: TemplateType) => {
      const key = `${tab}-${template.id}`; 
      if (checkTemplate(template)) {
        this.hasNotifications = true;
        this.templatesNeedingExecution[key] = true;
        this.tabsNeedingExecution[tab] = true;
      }
      
    };
  
    this.medicineTemplates.forEach(template => updateTabStatus(template, 'medicine-request'));
    this.auditTemplates.forEach(template => updateTabStatus(template, 'audit'));
    this.tenderTemplates.forEach(template => updateTabStatus(template, 'tender'));
  }

  
  toggleTemplateStatus(type: TemplateType, id: number, isActive: boolean): void {
    const action = isActive ? this.templateService.activateTemplate : this.templateService.deactivateTemplate;
    action.call(this.templateService, type, id).subscribe(() => {
      this.loadTemplates();
      this.checkNotifications();
    });
  }
  
  
  viewTemplateDetails(template: Template): void {
    
    this.isDetailsVisible = true;
    this.isFormVisible = false;
    this.selectedTemplate = template;
  }

  closeDetails(): void {
    this.isDetailsVisible = false;
    this.selectedTemplate = null;
  }

  // OTHER STUFF

  showModal = false;
  isFormVisible = false;
  isDetailsVisible = false;
  isEditMode = false;
  activeTab: TemplateType = 'medicine-request';
  
  medicines: ReturnMedicineDTO[] = [];
  medicineTemplates: MedicineRequestTemplateDTO[] = [];
  auditTemplates: AuditTemplateDTO[] = [];
  tenderTemplates: TenderTemplateDTO[] = [];
  
  selectedTemplate: Template | null = null;

  isMedicineRequest(template: Template | null): template is MedicineRequestTemplateDTO {
    return template !== null && 'createDTO' in template && 'medicineId' in template.createDTO;
  }

  isAudit(template: Template | null): template is AuditTemplateDTO {
    return template !== null && 'createDTO' in template && 'medicineIds' in template.createDTO;
  }

  isTender(template: Template | null): template is TenderTemplateDTO {
    return template !== null && 'createDTO' in template && 'title' in template.createDTO;
  }

  medicineForm!: FormGroup;
  auditForm!: FormGroup;
  tenderForm!: FormGroup;

  getCurrentTemplates(): Template[] {
    switch (this.activeTab) {
      case 'medicine-request':
        return this.medicineTemplates;
      case 'audit':
        return this.auditTemplates;
      case 'tender':
        return this.tenderTemplates;
      default:
        return [];
    }
  }

  showCreateForm(): void {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.isDetailsVisible = false;
    this.getActiveForm().reset();
  }

  editTemplate(template: Template): void {
    this.isFormVisible = true;
    this.isEditMode = true;
    this.isDetailsVisible = false;
    this.selectedTemplate = template;
    this.getActiveForm().patchValue(template);
  }


  cancelForm(): void {
    this.isFormVisible = false;
    this.isEditMode = false;
    this.selectedTemplate = null;
    this.getActiveForm().reset();
  }

  getMedicineName(id: number): string {
    return this.medicines.find(m => m.id === id)?.name || '';
  }

  constructor(
    private fb: FormBuilder,
    private templateService: NotificationTemplateService,
    private medicineService: MedicineService
  ) {}

  private createMedicineForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      recurrenceInterval: [0, [Validators.required, Validators.min(0)]],
      medicineId: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      justification: ['']
    });
  }

  private createAuditForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      recurrenceInterval: [0, [Validators.required, Validators.min(0)]],
      medicineIds: [[], Validators.required],
      notes: ['']
    });
  }

  private createTenderForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      recurrenceInterval: [0, [Validators.required, Validators.min(0)]],
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }  
  
  private initForms(): void {
    this.medicineForm = this.createMedicineForm();
    this.auditForm = this.createAuditForm();
    this.tenderForm = this.createTenderForm();
  }

  ngOnInit(): void {
    this.initForms();
    this.loadData();
    this.checkNotifications();
  }


  toggleModal(): void {
    this.showModal = !this.showModal;
  }
  
  setActiveTab(tab: TemplateType): void {
    this.activeTab = tab;
  }
  
  getActiveForm(): FormGroup {
    switch (this.activeTab) {
      case 'medicine-request':
        return this.medicineForm;
      case 'audit':
        return this.auditForm;
      case 'tender':
        return this.tenderForm;
      default:
        throw new Error('Invalid tab');
    }
  }

  private loadData(): void {
    forkJoin({
        medicines: this.medicineService.getAllMedicines(),
        medicineTemplates: this.templateService.getTemplatesByUserId<MedicineRequestTemplateDTO>('medicine-request'),
        auditTemplates: this.templateService.getTemplatesByUserId<AuditTemplateDTO>('audit'),
        tenderTemplates: this.templateService.getTemplatesByUserId<TenderTemplateDTO>('tender')
    }).subscribe({
        next: (result) => {
            this.medicines = result.medicines.items;
            this.medicineTemplates = result.medicineTemplates;
            this.auditTemplates = result.auditTemplates;
            this.tenderTemplates = result.tenderTemplates;
            this.checkNotifications(); 
        },
        error: (error) => console.error('Failed to load initial data', error)
    });
}

  
  loadMedicines(): void {
    this.medicineService.getMedicinesWithFilter({
      pageNumber: 1,
      pageSize: 999,
      sortBy: 'name'
    }).subscribe({
      next: (response) => this.medicines = response.items,
      error: () => console.error('Failed to load medicines')
    });
  }

  showExecuteDateModal = false;
  selectedTemplateForExecution: { type: TemplateType; id: number } | null = null;

  onExecuteClick(type: TemplateType, id: number): void {
    this.selectedTemplateForExecution = { type, id };
    this.showExecuteDateModal = true;
  }

  onExecuteDateConfirmed(date: Date): void {
    if (this.selectedTemplateForExecution) {
      this.executeTemplate(
        this.selectedTemplateForExecution.type,
        this.selectedTemplateForExecution.id,
        date
      );
    }
    this.showExecuteDateModal = false;
    this.selectedTemplateForExecution = null;
  }

  onExecuteDateCancelled(): void {
    this.showExecuteDateModal = false;
    this.selectedTemplateForExecution = null;
  }

  executeTemplate(type: TemplateType, id: number, date: Date): void {
    this.templateService.executeTemplate(type, id, date).subscribe(() => {
        this.loadTemplates();
        this.checkNotifications(); 
    });
  }


  deleteTemplate(type: TemplateType, id: number): void {
    this.templateService.deleteTemplate(type, id).subscribe(() => this.loadTemplates());
  }


  loadTemplates(): void {
    forkJoin({
      medicineTemplates: this.templateService.getTemplatesByUserId<MedicineRequestTemplateDTO>('medicine-request'),
      auditTemplates: this.templateService.getTemplatesByUserId<AuditTemplateDTO>('audit'),
      tenderTemplates: this.templateService.getTemplatesByUserId<TenderTemplateDTO>('tender')
    }).subscribe({
      next: (result) => {
        this.medicineTemplates = result.medicineTemplates;
        this.auditTemplates = result.auditTemplates;
        this.tenderTemplates = result.tenderTemplates;
      },
      error: (error) => console.error('Failed to reload templates', error)
    });
  }
  private mapToCreateTemplate(type: TemplateType, formValue: any): CreateAuditTemplate | CreateMedicineRequestTemplate | CreateTenderTemplate {
    switch (type) {
      case 'audit':
        return {
          medicineIds: formValue.medicineIds || [],
          notes: formValue.notes || null
        };
  
      case 'tender':
        return {
          title: formValue.title,
          description: formValue.description
        };
  
      case 'medicine-request':
        return {
          medicineId: formValue.medicineId,
          quantity: formValue.quantity,
          justification: formValue.justification || ''
        };
  
      default:
        throw new Error(`Unsupported template type: ${type}`);
    }
  }
  
  private mapToNotificationTemplate(type: TemplateType, formValue: any): Template {
    return {
      id: formValue.id || 0,
      name: formValue.name,
      recurrenceInterval: formValue.recurrenceInterval,
      lastExecutedDate: formValue.lastExecutedDate ? new Date(formValue.lastExecutedDate) : undefined,
      isActive: formValue.isActive || false,
      createDTO: this.mapToCreateTemplate(type, formValue)
    } as Template;
  }
  

  submitForm(type: TemplateType): void {
    const form = this.getActiveForm();
    if (form.valid) {
      const request = form.value;
      const templateDTO = this.mapToNotificationTemplate(type, request);
  
      if (this.isEditMode && this.selectedTemplate) 
      {
        this.templateService.updateTemplate(type, this.selectedTemplate.id, templateDTO).subscribe({
          next: () => {
            this.loadTemplates();
            this.cancelForm();
          },
          error: (error) => console.error('Failed to update template', error)
        });
      } 
      else 
      {
        this.templateService.createTemplate(type, templateDTO).subscribe({
          next: () => {
            this.loadTemplates();
            this.cancelForm();
          },
          error: (error) => console.error('Failed to create template', error)
        });
      }
    }
  }
  
}
