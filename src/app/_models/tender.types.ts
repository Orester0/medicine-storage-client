import { ReturnMedicineDTO } from "./medicine.types";
import { UserDTO } from "./user.types";

export interface ReturnTenderDTO {
   id: number;
   title: string;
   description: string;
   publishDate: Date;
   closingDate?: Date;
   deadlineDate: Date;
   status: TenderStatus;
   createdByUser?: UserDTO;
   openedByUser?: UserDTO;
   closedByUser?: UserDTO;
   winnerSelectedByUser?: UserDTO;
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
   createdByUser?: UserDTO;
   items: ReturnTenderProposalItem[];
}
 
export interface CreateTenderProposal {
   totalPrice: number;
   proposalItemsDTOs: CreateTenderProposalItem[];
}
 
export interface ReturnTenderProposalItem {
   id: number;
   tenderProposalId: number;
   unitPrice: number;
   quantity: number;
   totalItemPrice: number;
   medicine: ReturnMedicineDTO;
}
 

export interface CreateTenderProposalItem {
   tenderProposalId: number;
   medicineId: number;
   unitPrice: number;
   quantity: number;
}
export interface TenderParams {
   title?: string;
   publishDateFrom?: Date;
   publishDateTo?: Date;
   closingDateFrom?: Date;
   closingDateTo?: Date;
   deadlineDateFrom?: Date;
   deadlineDateTo?: Date;
   status?: TenderStatus;
   createdByUserId?: number;
   openedByUserId?: number;
   closedByUserId?: number;
   winnerSelectedByUserId?: number;
   sortBy?: string;
   isDescending?: boolean;
   pageNumber?: number;
   pageSize?: number;
}


export enum TenderItemStatus {
   Pending = 0,
   Executed = 1
}

export enum TenderStatus {
  Created = 0,
  Published = 1,
  Closed = 2,
  Awarded = 3,
  Executing = 4,
  Executed = 5,
  Cancelled = 6
}

export enum ProposalStatus {
   Submitted = 1,
   Accepted = 2,
   Rejected = 3
}