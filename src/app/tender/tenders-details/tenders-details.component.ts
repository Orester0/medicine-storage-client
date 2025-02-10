import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CreateTenderItem, CreateTenderProposal, CreateTenderProposalItem, ProposalStatus, ReturnTenderDTO, ReturnTenderItem as ReturnTenderItemDTO, ReturnTenderProposal as ReturnTenderProposalDTO, TenderItemStatus, TenderStatus } from '../../_models/tender.types';
import { TenderService } from '../../_services/tender.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { CreateTenderProposalComponent } from '../create-tender-proposal/create-tender-proposal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TableAction, TableColumn, TableComponent } from '../../table/table.component';
import { TenderItemsComponent } from '../tender-items/tender-items.component';
import { DeleteConfirmationModalComponent } from '../../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-tenders-details',
  templateUrl: './tenders-details.component.html',
  styleUrls: ['./tenders-details.component.css'],
  imports: [CommonModule, ReactiveFormsModule, CreateTenderProposalComponent, TableComponent, TenderItemsComponent, DeleteConfirmationModalComponent],
  providers: [CurrencyPipe]
})
export class TendersDetailsComponent implements OnInit {
 itemsTableActions: TableAction<ReturnTenderItemDTO>[] = [
    {
      label: 'Execute',
      class: 'btn btn-primary btn-sm',
      onClick: (row) => {
        const winningProposal = this.proposals.find(p => p.status === ProposalStatus.Accepted);
        if (winningProposal) {
          this.executeTenderItem(row.id, winningProposal.id);
        }
      },
      visible: (row) => row.status === TenderItemStatus.Pending && this.tender.status === TenderStatus.Executing,
    },
  ];
  
  
  itemsTableColumns: TableColumn<ReturnTenderItemDTO>[] = [
    {
      key: 'medicine',
      label: 'Medicine',
      render: (row) => `${row.name}`,
    },
    {
      key: 'requiredQuantity',
      label: 'Quantity',
      render: (row) => `${row}`, 
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => this.getTextByItemStatus(row),
    },
    {
      key: 'actions',
      label: 'Actions',
    },
  ];

  
  proposalTableActions: TableAction<ReturnTenderProposalDTO>[] = [
    {
      label: 'Select Winner',
      class: 'btn btn-success btn-sm me-1',
      onClick: (row) => this.selectWinner(row.id),
      visible: (row) => row.status === ProposalStatus.Submitted && this.tender.status === TenderStatus.Closed,
    },
    {
      label: 'Execute',
      class: 'btn btn-primary btn-sm',
      onClick: (row) => this.executeProposal(row.id),
      visible: (row) => this.tender.status === TenderStatus.Awarded,
    },
    
  ];

  proposalTableColumns: TableColumn<ReturnTenderProposalDTO>[] = [
    {
      key: 'createdByUser',
      label: 'Vendor',
      render: (value) => `${value?.firstName} ${value?.lastName}`,
    },
    {
      key: 'totalPrice',
      label: 'Amount',
      render: (value) => this.currencyPipe.transform(value) || '0.00', 
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => this.getTextByProposalStatus(value),
    },
    {
      key: 'submissionDate',
      label: 'Submission Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'items',
      label: 'Items Count',
      render: (value) => value?.length,
    },
    {
      key: 'actions',
      label: 'Actions',
    },
  ];

  // delete
  tenderToDelete: ReturnTenderDTO | null = null;

  deleteTenderPrompt(tender: ReturnTenderDTO): void {
    this.tenderToDelete = tender;
  }

  handleDeleteConfirm(): void {
    if (!this.tenderToDelete) return;
    this.tenderService.deleteTender(this.tenderToDelete.id).subscribe({
      next: () => {
        this.tenderToDelete = null;
      },
      error: () => {
        console.error('Failed to delete tender.');
      },
    });
  }

  handleDeleteCancel(): void {
    this.tenderToDelete = null;
  }

  // tender item
  isTenderItemModalOpen = false;
  saveTenderItem(tenderItem: CreateTenderItem): void {
    this.tenderService.addTenderItem(tenderItem.tenderId, tenderItem).subscribe(() => {
      this.reloadTenderInfo();
      this.isTenderItemModalOpen = false;
    });
  }
  
  openAddItemModal(tender: ReturnTenderDTO): void {
    this.tender = tender;
    this.isTenderItemModalOpen = true;
  }
  
  addItem(): void {
    this.openAddItemModal(this.tender);
  }

  // load data

  constructor(
    private tenderService: TenderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tender = this.route.snapshot.data['tender'];
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.reloadTenderInfo();
  }

  reloadTenderInfo() {
    this.tenderService.getTenderById(this.tender.id).subscribe((tender) => {
      this.tender = tender;
      this.loadProposals();
    });
  }

  loadProposals() {
    this.tenderService.getProposalsByTenderId(this.tender.id).subscribe((proposals) => {
      this.proposals = proposals;
    });
  }






  allMedicines: ReturnMedicineDTO[] = [];
  private currencyPipe = inject(CurrencyPipe);

  tender!: ReturnTenderDTO;
  @Output() onClose = new EventEmitter<void>();
  
  proposals: ReturnTenderProposalDTO[] = [];
  showProposalModal = false;
  
  TenderStatus = TenderStatus; 

  ProposalStatus = ProposalStatus; 
  


  closeDetails(): void {
    this.router.navigate(['/tenders']);
  }

  openProposalModal(): void {
    this.showProposalModal = true;
  }

  closeProposalModal(): void {
    this.showProposalModal = false;
    this.reloadTenderInfo();
  }

  selectWinner(proposalId: number): void {
    this.tenderService.selectWinningProposal(this.tender.id, proposalId)
      .subscribe({
        next: () => {
          this.reloadTenderInfo();
        },
      });
  }

  executeProposal(proposalId: number): void {
    this.tenderService.executeTenderProposal(proposalId)
      .subscribe({
        next: () => {
          this.reloadTenderInfo();
        },
      });
  }

  
  publishTender(): void {
    this.tenderService.publishTender(this.tender.id).subscribe({
      next: () => {
        this.reloadTenderInfo();
      }
    });
  }

  closeTender(): void {
    this.tenderService.closeTender(this.tender.id).subscribe({
      next: () => {
        this.reloadTenderInfo();
      }
    });
  }

  executeTenderItem(tenderItemId: number, proposalId: number): void {
    this.tenderService.executeTenderProposalItem(tenderItemId, proposalId)
      .subscribe({
        next: () => {
          this.reloadTenderInfo();
        }
      });
  }


  

  
  getTextByTenderStatus(status: TenderStatus): string {
    const statusMap = {
      [TenderStatus.Created]: 'Created',
      [TenderStatus.Published]: 'Published',
      [TenderStatus.Closed]: 'Closed',
      [TenderStatus.Awarded]: 'Awarded',
      [TenderStatus.Executing]: 'Executing',
      [TenderStatus.Executed]: 'Executed',
      [TenderStatus.Cancelled]: 'Cancelled'
    };
    return statusMap[status] || 'Unknown';
  }

  getBadgeByTenderStatus(status: TenderStatus): string {
    const baseClasses = 'badge rounded-pill';
    const statusClasses = {
      [TenderStatus.Created]: 'bg-secondary',
      [TenderStatus.Published]: 'bg-primary',
      [TenderStatus.Closed]: 'bg-info',
      [TenderStatus.Awarded]: 'bg-success',
      [TenderStatus.Executing]: 'bg-warning',
      [TenderStatus.Executed]: 'bg-success',
      [TenderStatus.Cancelled]: 'bg-danger'
    };
    return `${baseClasses} ${statusClasses[status] || 'bg-secondary'}`;
  }

  getTextByItemStatus(status: TenderItemStatus): string {
    const statusMap = {
      [TenderItemStatus.Pending]: 'Pending',
      [TenderItemStatus.Executed]: 'Executed'
    };
    return statusMap[status] || 'Unknown';
  }

  getBadgeByItemStatus(status: TenderItemStatus): string {
    const baseClasses = 'badge rounded-pill';
    const statusClasses = {
      [TenderItemStatus.Pending]: 'bg-warning',
      [TenderItemStatus.Executed]: 'bg-success'
    };
    return `${baseClasses} ${statusClasses[status] || 'bg-secondary'}`;
  }

  getTextByProposalStatus(status: ProposalStatus): string {
    const statusMap = {
      [ProposalStatus.Submitted]: 'Submitted',
      [ProposalStatus.Accepted]: 'Accepted',
      [ProposalStatus.Rejected]: 'Rejected'
    };
    return statusMap[status] || 'Unknown';
  }

  getBadgeByProposalStatus(status: ProposalStatus): string {
    const baseClasses = 'badge rounded-pill';
    const statusClasses = {
      [ProposalStatus.Submitted]: 'bg-info',
      [ProposalStatus.Accepted]: 'bg-success',
      [ProposalStatus.Rejected]: 'bg-danger'
    };
    return `${baseClasses} ${statusClasses[status] || 'bg-secondary'}`;
  }
}
