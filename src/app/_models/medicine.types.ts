export interface ReturnMedicineDTO {
  id: number;
  name: string;
  description: string; 
  category: string;
  requiresSpecialApproval: boolean;
  minimumStock: number;
  stock: number;
  auditFrequencyDays: number;
  lastAuditDate?: Date;
}

export interface CreateMedicineDTO {
  name: string;
  description: string;
  category: string;
  requiresSpecialApproval: boolean;
  minimumStock: number;
  auditFrequencyDays: number;
}
  
export interface MedicineParams {
  name?: string | null;
  category?: string[];
  requiresSpecialApproval?: boolean | null;
  minStock?: number | null;
  maxStock?: number | null;
  sortBy?: string;
  isDescending?: boolean;
  pageNumber: number;
  pageSize: number;
}