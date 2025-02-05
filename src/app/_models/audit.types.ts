import { ReturnMedicineDTO } from "./medicine.types";
import { UserDTO } from "./user.types";

export interface CreateAuditDTO {
   medicineIds: number[];
   notes?: string | null;
   plannedDate: Date;
}
 
export interface AuditNotes {
   notes?: string | null;
}
 
export interface UpdateAuditItemsRequest {
   actualQuantities: { [key: number]: number };
   notes?: string | null;
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

export interface ReturnAuditDTO {
   id: number;
   plannedDate: Date;
   startDate?: Date | null;
   endDate?: Date | null;
   notes?: string | null;
   status: AuditStatus;
   plannedByUser: UserDTO;
   executedByUser: UserDTO;
   auditItems: ReturnAuditItemDTO[];
}

export interface ReturnAuditItemDTO {
   id: number;
   auditId: number;
   expectedQuantity: number;
   actualQuantity: number;
   medicine: ReturnMedicineDTO;
}

export enum AuditStatus {
   Planned = 1,
   InProgress = 2,
   Completed = 3,
   RequiresFollowUp = 4,
   Cancelled = 5,
 }