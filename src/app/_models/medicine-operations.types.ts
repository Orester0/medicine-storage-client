import { ReturnMedicineDTO } from "./medicine.types";
import { ReturnUserDTO } from "./user.types";

export interface ReturnMedicineRequestDTO {
   id: number;
   quantity: number;
   status: RequestStatus;
   requestDate: Date;
   requiredByDate: Date;
   justification?: string;
   approvalDate?: Date;
   medicine: ReturnMedicineDTO;
   requestedByUser: ReturnUserDTO;
   approvedByUser?: ReturnUserDTO;
}
 
export interface CreateMedicineRequestDTO {
   medicineId: number;
   quantity: number;
   requiredByDate: Date;
   justification?: string;
}
 
 export interface ReturnMedicineUsageDTO {
   id: number;
   quantity: number;
   usageDate: Date;
   medicine: ReturnMedicineDTO;
   usedByUser: ReturnUserDTO;
}
 
export interface CreateMedicineUsageDTO {
   medicineId: number;
   quantity: number;
}
 
 export enum RequestStatus {
   Pending = 1,
   PedingWithSpecial = 2,
   Approved = 3,
   Rejected = 4
 }

 export interface MedicineUsageParams {
   fromDate?: Date;
   toDate?: Date;
   medicineId?: number;
   usedByUserId?: number;
   medicineRequestId?: number;
   minQuantity?: number;
   maxQuantity?: number;
   notes?: string;
   sortBy?: string;
   isDescending: boolean;
   pageNumber?: number;
   pageSize?: number;
}

 export interface MedicineRequestParams {
   fromDate?: Date |  string | null;
   toDate?: Date |  string | null;
   status?: RequestStatus | null;
   requestedByUserId?: number | null;
   approvedByUserId?: number | null;
   medicineId?: number | null;
   minQuantity?: number;
   maxQuantity?: number;
   justification?: string;
   sortBy?: string;
   isDescending: boolean;
   pageNumber?: number;
   pageSize?: number;
}

 
 