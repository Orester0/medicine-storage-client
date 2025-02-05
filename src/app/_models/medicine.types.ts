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
  description?: string | null;
  category?: string | null; 
  requiresSpecialApproval?: boolean | null;
  minStock?: number | null;
  maxStock?: number | null;
  minMinimumStock?: number | null;
  maxMinimumStock?: number | null;
  requiresStrictAudit?: boolean | null;
  minAuditFrequencyDays?: number | null;
  maxAuditFrequencyDays?: number | null;
  sortBy?: string;
  isDescending?: boolean;
  pageNumber: number;
  pageSize: number;
}