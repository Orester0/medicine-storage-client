import { ReturnMedicineDTO } from "./medicine.types";
import { ReturnUserGeneralDTO } from "./user.types";


export interface AuditParams {
  title?: string | null;
  fromPlannedDate?: Date | string | null;
  toPlannedDate?: Date | string | null; 
  statuses?: AuditStatus[]; 
  plannedByUserId?: number | null;
  closedByUserId?: number | null;
  executedByUserId?: number | null;
  sortBy?: string;
  isDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateAuditDTO {
  title: string;
  medicineIds: number[];
  notes?: string | null;
  plannedDate: Date;
}
 
 
export interface CreateAuditNoteDTO {
  note: string;
}

  

export interface ReturnAuditDTO {
  id: number;
  title: string;
  plannedDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  status: AuditStatus;
  plannedByUser: ReturnUserGeneralDTO;
  closedByUser: ReturnUserGeneralDTO | null;
  auditItems: ReturnAuditItemDTO[];
  notes: ReturnAuditNoteDTO[];
}

export interface ReturnAuditItemDTO {
  id: number;
  auditId: number;
  expectedQuantity: number;
  actualQuantity: number;
  medicine: ReturnMedicineDTO;
  checkedByUser: ReturnUserGeneralDTO | null;
}

 export interface ReturnAuditNoteDTO {
   note: string;
   createdAt: Date;
 }
 
 export interface UpdateAuditItemsRequest {
   actualQuantities: { [key: number]: number };
   notes?: string | null;
 }
 


export enum AuditStatus {
   Planned = 1,
   InProgress = 2,
   Completed = 3,
   RequiresFollowUp = 4,
   Cancelled = 5,
 }

 