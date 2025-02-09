import { ReturnMedicineDTO } from "./medicine.types";
import { ReturnUserDTO } from "./user.types";

export interface ReturnTenderDTO {
   id: number;
   title: string;
   description: string;
   publishDate: Date;
   closingDate?: Date;
   deadlineDate: Date;
   status: TenderStatus;
   createdByUser?: ReturnUserDTO;
   openedByUser?: ReturnUserDTO;
   closedByUser?: ReturnUserDTO;
   winnerSelectedByUser?: ReturnUserDTO;
   items: ReturnTenderItem[];
   proposals: ReturnTenderProposal[];
}
 
export interface CreateTenderDTO {
   title: string;
   description: string;
   deadlineDate: Date;
}

 
export interface ReturnTenderItem {
   id: number;
   tenderId: number;
   requiredQuantity: number;
   status: TenderItemStatus;
   medicine: ReturnMedicineDTO;
}
 
export interface CreateTenderItem {
   medicineId: number;
   tenderId: number;
   requiredQuantity: number;
}
 

export interface ReturnTenderProposal {
   id: number;
   tenderId: number;
   totalPrice: number;
   submissionDate: Date;
   status: ProposalStatus;
   createdByUser?: ReturnUserDTO;
   items: ReturnTenderProposalItem[];
}
 

export interface ReturnTenderProposalItem {
   id: number;
   tenderProposalId: number;
   unitPrice: number;
   quantity: number;
   totalItemPrice: number;
   medicine: ReturnMedicineDTO;
}
export interface CreateTenderProposal {
   totalPrice: number;
   proposalItemsDTOs: CreateTenderProposalItem[];
}
 

export interface CreateTenderProposalItem {
   tenderProposalId: number;
   medicineId: number;
   unitPrice: number;
   quantity: number;
}
export interface TenderParams {
   title?: string | null;
   publishDateFrom?: Date | null;
   publishDateTo?: Date | null;
   closingDateFrom?: Date | null;
   closingDateTo?: Date | null;
   deadlineDateFrom?: Date | null;
   deadlineDateTo?: Date | null;
   status?: TenderStatus | null;
   createdByUserId?: number | null;
   openedByUserId?: number | null;
   closedByUserId?: number | null;
   winnerSelectedByUserId?: number | null;
   sortBy?: string;
   isDescending?: boolean;
   pageNumber?: number;
   pageSize?: number;
}


export enum TenderItemStatus {
   Pending = 1,
   Executed = 2
}

export enum TenderStatus {
  Created = 1,
  Published = 2,
  Closed = 3,
  Awarded = 4,
  Executing = 5,
  Executed = 6,
  Cancelled = 7
}

export enum ProposalStatus {
   Submitted = 1,
   Accepted = 2,
   Rejected = 3
}