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
 
 export enum RequestStatus {
   Pending = 1,
   PedingWithSpecial = 2,
   Approved = 3,
   Rejected = 4
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

 
 