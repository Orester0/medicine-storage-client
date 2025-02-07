import { ReturnMedicineDTO } from "./medicine.types";
import { ReturnUserDTO } from "./user.types";

export interface CreateAuditDTO {
   medicineIds: number[];
   notes?: string | null;
   plannedDate: Date;
 }
 
 
 export interface CreateAuditNoteDTO {
  note: string;
  }

 
export interface ReturnAuditDTO {
  id: number;
  plannedDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  status: AuditStatus;
  plannedByUser: ReturnUserDTO;
  closedByUser: ReturnUserDTO | null;
  auditItems: ReturnAuditItemDTO[];
  notes: ReturnAuditNoteDTO[];
}

export interface ReturnAuditItemDTO {
  id: number;
  auditId: number;
  expectedQuantity: number;
  actualQuantity: number;
  medicine: ReturnMedicineDTO;
  checkedByUser: ReturnUserDTO | null;
}

 export interface ReturnAuditNoteDTO {
   note: string;
   createdAt: Date;
 }
 
 export interface UpdateAuditItemsRequest {
   actualQuantities: { [key: number]: number };
   notes?: string | null;
 }
 

export interface ReturnAuditDTO {
   id: number;
   plannedDate: Date;
   startDate: Date | null;
   endDate: Date | null;
   status: AuditStatus;
   plannedByUser: ReturnUserDTO;
   closedByUser: ReturnUserDTO | null;
   auditItems: ReturnAuditItemDTO[];
   notes: ReturnAuditNoteDTO[];
 }

 export interface ReturnAuditItemDTO {
   id: number;
   auditId: number;
   expectedQuantity: number;
   actualQuantity: number;
   medicine: ReturnMedicineDTO;
   checkedByUser: ReturnUserDTO | null;
 }





export enum AuditStatus {
   Planned = 1,
   InProgress = 2,
   Completed = 3,
   RequiresFollowUp = 4,
   Cancelled = 5,
 }

 
export interface AuditParams {
   fromDate?: Date | string | null;
   toDate?: Date | string | null;
   status?: AuditStatus | null;
   plannedByUserId?: number | null;
   executedByUserId?: number | null;
   notes?: string | null;
   sortBy?: string;
   isDescending?: boolean;
   pageNumber?: number;
   pageSize?: number;
}