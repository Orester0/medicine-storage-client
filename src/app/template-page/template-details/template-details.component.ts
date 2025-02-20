import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { Template, TemplateType, MedicineRequestTemplateDTO, AuditTemplateDTO, TenderTemplateDTO } from '../../_models/template.types';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalizedDatePipe } from '../../_pipes/localized-date.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-template-details',
  imports: [CommonModule, ReactiveFormsModule, LocalizedDatePipe, MatIconModule],
  templateUrl: './template-details.component.html',
  styleUrl: './template-details.component.css'
})
export class TemplateDetailsComponent {
  @Input() template!: Template;
  @Input() type!: TemplateType;
  @Input() medicines: ReturnMedicineDTO[] = [];
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Template>();
  @Output() execute = new EventEmitter<Template>();
  @Output() delete = new EventEmitter<Template>();

  getMedicineName(id: number): string {
    return this.medicines.find(m => m.id === id)?.name || '';
  }

  isMedicineRequest(template: Template): template is MedicineRequestTemplateDTO {
    return 'createDTO' in template && 'medicineId' in template.createDTO;
  }

  isAudit(template: Template): template is AuditTemplateDTO {
    return 'createDTO' in template && 'medicineIds' in template.createDTO;
  }

  isTender(template: Template): template is TenderTemplateDTO {
    return 'createDTO' in template && 'title' in template.createDTO;
  }
}
