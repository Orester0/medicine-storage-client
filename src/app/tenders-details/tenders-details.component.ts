import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateTenderProposal, CreateTenderProposalItem, ProposalStatus, ReturnTenderDTO, ReturnTenderItem, ReturnTenderProposal, TenderItemStatus, TenderStatus } from '../_models/tender.types';
import { TenderService } from '../_services/tender.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicineParams, ReturnMedicineDTO } from '../_models/medicine.types';
import { MedicineService } from '../_services/medicine.service';

@Component({
  selector: 'app-tenders-details',
  templateUrl: './tenders-details.component.html',
  styleUrls: ['./tenders-details.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class TendersDetailsComponent implements OnInit {
  @Input() tender!: ReturnTenderDTO;
  @Output() onClose = new EventEmitter<void>();

  tenderItems: ReturnTenderItem[] = [];
  proposals: ReturnTenderProposal[] = [];
  error: string | null = null;

  proposalForm!: FormGroup;
  medicines: ReturnMedicineDTO[] = [];
  showProposalForm = false;

  constructor(
    private fb: FormBuilder,
    private tenderService: TenderService,
    private medicineService: MedicineService
  ) {}

  ngOnInit(): void {
    this.loadTenderItems();
    this.loadProposals();
    this.loadMedicines();
    this.initForm();
  }

  


  toggleProposalForm() {
    this.showProposalForm = !this.showProposalForm;
  }


  selectWinner(proposalId: number): void {
    this.tenderService.selectWinningProposal(this.tender.id, proposalId).subscribe({
      next: (updatedTender) => {
        this.tender = updatedTender;
        this.loadProposals();
      },
      error: () => {
        this.error = 'Failed to select winning proposal';
      }
    });
  }

  closeDetails(): void {
    this.onClose.emit();
  }

  executeTenderItem(tenderItemId: number, proposalId: number): void {
    this.tenderService.executeTenderItem(tenderItemId, proposalId).subscribe({
      next: () => {
        this.loadTenderItems();
      },
      error: () => {
        this.error = 'Failed to execute tender item';
      }
    });
  }

  executeTender(proposalId: number): void {
    this.tenderService.executeTender(proposalId).subscribe({
      next: () => {
        this.loadProposals();
        this.loadTenderItems();
      },
      error: () => {
        this.error = 'Failed to execute tender';
      }
    });
  }

  getStatusBadgeClass(status: TenderStatus): string {
    switch (status) {
      case TenderStatus.Created: return 'bg-secondary';
      case TenderStatus.Published: return 'bg-success';
      case TenderStatus.Closed: return 'bg-warning';
      case TenderStatus.Awarded: return 'bg-info';
      case TenderStatus.Executing: return 'bg-primary';
      case TenderStatus.Executed: return 'bg-dark';
      case TenderStatus.Cancelled: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getItemStatusBadgeClass(status: TenderItemStatus): string {
    switch (status) {
      case TenderItemStatus.Pending: return 'bg-warning';
      case TenderItemStatus.Executed: return 'bg-success';
      default: return 'bg-secondary';
    }
  }



   getTenderStatusText(status: TenderStatus): string {
    switch (status) {
      case TenderStatus.Created:
        return 'Created';
      case TenderStatus.Published:
        return 'Published';
      case TenderStatus.Closed:
        return 'Closed';
      case TenderStatus.Awarded:
        return 'Awarded';
      case TenderStatus.Executing:
        return 'Executing';
      case TenderStatus.Executed:
        return 'Executed';
      case TenderStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  getProposalStatusText(status: ProposalStatus): string {
    switch (status) {
      case ProposalStatus.Submitted:
        return 'Submitted';
      case ProposalStatus.Accepted:
        return 'Accepted';
      case ProposalStatus.Rejected:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  getProposalStatusBadgeClass(status: ProposalStatus): string {
    switch (status) {
      case ProposalStatus.Submitted: return 'bg-primary';
      case ProposalStatus.Accepted: return 'bg-success';
      case ProposalStatus.Rejected: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }



  initForm() {
    this.proposalForm = this.fb.group({
      proposalItems: this.fb.array([])
    });
  }

  loadTenderItems() {
    this.tenderService.getTenderItems(this.tender.id).subscribe((items) => {
      this.tenderItems = items;
      this.initProposalItems();
    });
  }

  loadProposals() {
    this.tenderService.getProposalsByTenderId(this.tender.id).subscribe((proposals) => {
      this.proposals = proposals;
    });
  }

  loadMedicines() {
    this.medicineService.getMedicinesWithFilter({ pageNumber: 1, pageSize: 999, sortBy: "name" }).subscribe((response) => {
      this.medicines = response.items;
    });
  }

  initProposalItems() {
    const proposalItemsArray = this.proposalForm.get('proposalItems') as FormArray;
    this.tenderItems.forEach(item => {
      proposalItemsArray.push(
        this.fb.group({
          medicineId: [item.medicine.id],
          quantity: [item.requiredQuantity, [Validators.required, Validators.min(1)]],
          unitPrice: [0, [Validators.required, Validators.min(0)]]
        })
      );
    });
  }

  get proposalItemsControls() {
    return (this.proposalForm.get('proposalItems') as FormArray).controls;
  }

  getMedicineName(medicineId: number): string {
    const medicine = this.medicines.find(m => m.id === medicineId);
    return medicine?.name || 'Unknown';
  }

  onSubmitProposal() {
    if (this.proposalForm.valid) {
      const proposalItems: CreateTenderProposalItem[] = this.proposalForm.value.proposalItems.map(
        (item: any) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          tenderProposalId: 0
        })
      );

      const totalPrice = proposalItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice, 0
      );

      const proposal: CreateTenderProposal = {
        totalPrice,
        proposalItemsDTOs: proposalItems
      };

      this.tenderService.submitProposal(this.tender.id, proposal).subscribe(() => {
        this.showProposalForm = false;
        this.proposalForm.reset();
        this.loadProposals();
      });
    }
  }


}
