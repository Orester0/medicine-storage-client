export interface ReturnMedicineDTO {
  id: number;
  name: string;
  description: string; 
  category: string;
  requiresSpecialApproval: boolean;
  minimumStock: number;
  stock: number;
  requiresStrictAudit: boolean;
  auditFrequencyDays: number;
}

export interface CreateMedicineDTO {
  name: string;
  description: string;
  category: string;
  requiresSpecialApproval: boolean;
  minimumStock: number;
  requiresStrictAudit: boolean;
  auditFrequencyDays: number;
}
  
export interface MedicineParams {
  name?: string | null;
  category?: string | null; 
  requiresSpecialApproval?: boolean | null;
  minStock?: number | null;
  maxStock?: number | null;
  requiresStrictAudit?: boolean | null;
  sortBy?: string;
  isDescending?: boolean;
  pageNumber: number;
  pageSize: number;
}