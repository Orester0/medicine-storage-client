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
  name?: string;
  description?: string;
  category?: string;
  requiresSpecialApproval?: boolean;
  minStock?: number;
  maxStock?: number;
  minMinimumStock?: number;
  maxMinimumStock?: number;
  requiresStrictAudit?: boolean;
  minAuditFrequencyDays?: number;
  maxAuditFrequencyDays?: number;
  sortBy?: string;
  isDescending?: boolean;
  pageNumber: number;
  pageSize: number;
}