import { ReturnMedicineDTO } from "./medicine.types";
import { ReturnUserDTO } from "./user.types";

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
 

 export interface MedicineUsageParams {
   fromDate?: Date;
   toDate?: Date;
   medicineId?: number;
   usedByUserId?: number;
   sortBy?: string;
   isDescending: boolean;
   pageNumber?: number;
   pageSize?: number;
}