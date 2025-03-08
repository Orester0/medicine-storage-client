import { Component, inject } from '@angular/core';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { AuditTemplateDTO, MedicineRequestTemplateDTO, TenderTemplateDTO, Template, TemplateType, CreateAuditTemplate, CreateMedicineRequestTemplate, CreateTenderTemplate } from '../../_models/template.types';
import { ReactiveFormsModule } from '@angular/forms';
import { TemplateService } from '../../_services/template.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TemplateDatePickComponent } from '../template-date-pick/template-date-pick.component';
import { ActivatedRoute } from '@angular/router';
import { TemplateDetailsComponent } from '../template-details/template-details.component';
import { CreateTemplateFormComponent } from '../create-template-form/create-template-form.component';
import { ToastrService } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HasRoleDirective } from '../../_directives/has-role.directive';

@Component({
  selector: 'app-template',
  imports: [
    HasRoleDirective,
    MatTooltipModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    TemplateDatePickComponent,
    CreateTemplateFormComponent,
    TemplateDetailsComponent
  ],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent {
  private toastr = inject(ToastrService);
  private templateService = inject(TemplateService);
  private route = inject(ActivatedRoute);
  

  submitForm(zxc: Template): void {
    const template = this.mapToNotificationTemplate(this.activeTab, zxc);
    if (this.isEditMode && this.selectedTemplate) {
      this.templateService.updateTemplate(this.activeTab, this.selectedTemplate.id, template).subscribe(() => {
        this.loadTemplates();
        this.cancelForm();
      });
    } 
    else {
      this.templateService.createTemplate(this.activeTab, template).subscribe(() => {
        
      this.toastr.success('Template created succesfully');
        this.loadTemplates();
        this.cancelForm();
      });
    }
  }

  cancelForm(): void {
    this.isFormVisible = false;
    this.isEditMode = false;
    this.selectedTemplate = null;
  }
  
  



  // NOTIFICATIONS
  templatesNeedingExecution: Record<string, boolean> = {};
  tabsNeedingExecution: Record<TemplateType, boolean> = {
    'medicine-request': false,
    'audit': false,
    'tender': false
  };
  

  
  
  
  viewTemplateDetails(template: Template): void {
    this.selectedTemplate = template;
    this.isDetailsVisible = true;
    this.isFormVisible = false;
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
  }

  editTemplate(template: Template): void {
    this.isFormVisible = true;
    this.isEditMode = true;
    this.isDetailsVisible = false;
    this.selectedTemplate = template;
  }


  ngOnInit(): void {
    this.medicines = this.route.snapshot.data['medicines'];
    this.loadTemplates();
    this.checkNotifications();
  }


  toggleModal(): void {
    this.showModal = !this.showModal;
  }
  
  setActiveTab(tab: TemplateType): void {
    this.activeTab = tab;
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


  checkNotifications(): void {
    const today = new Date();
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

  executeTemplate(type: TemplateType, id: number, date: Date): void {
    this.templateService.executeTemplate(type, id, date).subscribe(() => {
      
      this.toastr.success('Template has been executed');
        this.loadTemplates();
        this.checkNotifications(); 
    });
  }


  handleDeleteConfirm(type: TemplateType, id: number): void {

    this.templateService.deleteTemplate(type, id).subscribe(() => {
      this.loadTemplates();
      this.toastr.success('Template has been deleted');
    });
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

  private mapToCreateTemplate(type: TemplateType, formValue: any): CreateAuditTemplate | CreateMedicineRequestTemplate | CreateTenderTemplate {
    switch (type) {
      case 'audit':
        return {
          title: formValue.title || '',
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
  
}
