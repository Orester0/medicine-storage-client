import { ReturnMedicineDTO } from "./medicine.types";
import { ReturnTenderDTO } from "./tender.types";
import { ReturnUserDTO } from "./user.types";

export interface ReturnMedicineSupplyDTO
{
   id: number;
   quantity: number;
   transactionDate: Date; 
   medicine: ReturnMedicineDTO;
   createdByUser?: ReturnUserDTO;
   tender?: ReturnTenderDTO;
}

export interface CreateMedicineSupplyDTO
{
   medicineId: number;
   quantity: number;
}

export interface MedicineSupplyParams {
   medicineId?: number | null;
   tenderId?: number| null;
   createdByUserId?: number| null;
   startDate?: Date| null; 
   endDate?: Date| null;
   sortBy?: string;
   isDescending?: boolean;
   pageNumber?: number;
   pageSize?: number;
 }
