import { ReturnMedicineDTO } from "./medicine.types";
import { ReturnUserGeneralDTO } from "./user.types";


export interface MedicineRequestAnalysisDto {
   medicineName: string;
   totalRequests: number;
   totalQuantity: number;
   uniqueRequesters: number;
   approvedCount: number;
   rejectedCount: number;
   pendingCount: number;
 }
 
export interface MedicineRequestAnalysisParams {
   medicineId?: number | null;
   statuses?: number[] | null;
   startDate: Date;  
   endDate: Date;
   sortBy?: string;
   isDescending?: boolean;
   pageNumber: number;
   pageSize: number;
 }
 
export interface MedicineRequestParams {
   fromDate?: Date |  string | null;
   toDate?: Date |  string | null;
   statuses?: number[] | null;
   requestedByUserId?: number | null;
   approvedByUserId?: number | null;
   medicineId?: number | null;
   minQuantity?: number;
   maxQuantity?: number;
   justification?: string;
   sortBy?: string;
   isDescending: boolean;
   pageNumber: number;
   pageSize: number;
}


export interface ReturnMedicineRequestDTO {
   id: number;
   quantity: number;
   status: RequestStatus;
   requestDate: Date;
   requiredByDate: Date;
   justification?: string;
   approvalDate?: Date;
   medicine: ReturnMedicineDTO;
   requestedByUser: ReturnUserGeneralDTO;
   approvedByUser?: ReturnUserGeneralDTO;
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
 


 
 