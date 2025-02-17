export abstract class NotificationTemplateBaseDTO<T> {
    id: number = 0;
    name: string = '';
    recurrenceInterval: number = 0;
    lastExecutedDate?: Date;
    isActive: boolean = false;
    createDTO!: T;
}
  
export class AuditTemplateDTO extends NotificationTemplateBaseDTO<CreateAuditTemplate> {}
export class TenderTemplateDTO extends NotificationTemplateBaseDTO<CreateTenderTemplate> {}
export class MedicineRequestTemplateDTO extends NotificationTemplateBaseDTO<CreateMedicineRequestTemplate> {}

export type TemplateType = 'medicine-request' | 'audit' | 'tender';
export type Template = AuditTemplateDTO | TenderTemplateDTO |MedicineRequestTemplateDTO;

export interface CreateAuditTemplate {
    title: string;
    medicineIds: number[];
    notes?: string | null;
 }

export interface CreateTenderTemplate {
    title: string;
    description: string;
 }
 
export interface CreateMedicineRequestTemplate {
    medicineId: number;
    quantity: number;
    justification?: string;
 } 

 
  