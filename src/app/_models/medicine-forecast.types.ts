import { ReturnMedicineDTO } from "./medicine.types";

export interface MedicineStockForecastDTO {
   currentStock: number;
   tenderStock?: number;
   requestedAmount?: number;
   projectedStock: number;
   medicine: ReturnMedicineDTO;
   needsRestock: boolean;
}