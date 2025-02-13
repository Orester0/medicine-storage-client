import { Component, inject, OnInit } from '@angular/core';
import { ReturnAuditDTO, AuditParams, AuditStatus, CreateAuditDTO, UpdateAuditItemsRequest } from '../../_models/audit.types';
import { AuditService } from '../../_services/audit.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuditsDetailsComponent } from '../audits-details/audits-details.component';
import { MedicineService } from '../../_services/medicine.service';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { TableAction, TableColumn, TableComponent } from '../../table/table.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { FilterComponent, FilterConfig } from '../../filter/filter.component';
import { CreateAuditFormComponent } from '../create-audit-form/create-audit-form.component';
import { ActivatedRoute } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../delete-confirmation-modal/delete-confirmation-modal.component';
import { AuditNotesComponent } from '../audit-notes/audit-notes.component';
import { AuditUpdateItemsComponent } from "../audit-update-items/audit-update-items.component";
import { AuditStatusPipe } from '../../_pipes/audit-status.pipe';

@Component({
  selector: 'app-audits',
  imports: [AuditNotesComponent, DeleteConfirmationModalComponent, CreateAuditFormComponent, FormsModule, CommonModule, AuditsDetailsComponent, TableComponent, PaginationComponent, ReactiveFormsModule, FilterComponent, AuditUpdateItemsComponent],
  providers: [AuditStatusPipe],
  templateUrl: './audits.component.html',
  styleUrl: './audits.component.css'
})
export class AuditsComponent implements OnInit {
  auditStatusPipe = inject(AuditStatusPipe);

  auditToDelete: ReturnAuditDTO | null = null;

  deleteAuditPrompt(audit: ReturnAuditDTO): void {
    this.auditToDelete = audit;
  }

  handleDeleteConfirm(): void {
    if (!this.auditToDelete) return;
    this.auditService.deleteAudit(this.auditToDelete.id).subscribe({
      next: () => {
        this.loadAudits();
        this.auditToDelete = null;
      },
      error: () => {
        console.error('Failed to delete tender.');
      },
    });
  }

  handleDeleteCancel(): void {
    this.auditToDelete = null;
  }


  filterConfig: FilterConfig[] = [
    {
      key: 'fromDate',
      label: 'From Date',
      type: 'date',
    },
    {
      key: 'toDate',
      label: 'To Date',
      type: 'date',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: Object.values(AuditStatus)
      .filter(status => typeof status === 'number') 
      .map(status => ({
        value: status as AuditStatus,
        label: this.auditStatusPipe.transform(status)
      }))
    },
    {
      key: 'plannedByUserId',
      label: 'Planned By User ID',
      type: 'number'
    },
    {
      key: 'executedByUserId',
      label: 'Executed By User ID',
      type: 'number'
    },
    {
      key: 'notes',
      label: 'Notes',
      type: 'text',
      col: 6
    }
  ];
  

  auditToStart: ReturnAuditDTO | null = null;
  auditToClose: ReturnAuditDTO | null = null;
  auditToUpdate: ReturnAuditDTO | null = null;

  startAudit(id: number) {
    const audit = this.audits.find(a => a.id === id);
    if (audit) this.auditToStart = audit;
  }

  closeAudit(id: number) {
    const audit = this.audits.find(a => a.id === id);
    if (audit) this.auditToClose = audit;
  }

  updateAudit(id: number) {
    const audit = this.audits.find(a => a.id === id);
    if (audit) this.auditToUpdate = audit;
  }

  handleStartSubmit(data: { note: string }) {
    console.log('Sending request with:', data); 
    if (!this.auditToStart) return;
    
    this.auditService.startAudit(this.auditToStart.id, { note: data.note }).subscribe({
      next: () => {
        this.loadAudits();
        this.auditToStart = null;
      },
      error: () => this.error = 'Failed to start audit'
    });
  }

  handleCloseSubmit(data: { note: string }) { 
    console.log('Sending request with:', data); 
    if (!this.auditToClose) return;

    this.auditService.closeAudit(this.auditToClose.id, { note: data.note }).subscribe({
      next: () => {
        this.loadAudits();
        this.auditToClose = null;
      },
      error: () => this.error = 'Failed to close audit'
    });
  }

  handleUpdateSubmit(data: UpdateAuditItemsRequest) {
    if (!this.auditToUpdate) return;

    this.auditService.updateAuditItems(this.auditToUpdate.id, data).subscribe({
      next: () => {
        this.loadAudits();
        this.auditToUpdate = null;
      },
      error: () => console.error('Failed to update audit items'),
    });
  }


  tableActions: TableAction<ReturnAuditDTO>[] = [
    {
      label: 'View',
      class: 'btn btn-info btn-sm',
      onClick: (row) => this.viewAuditDetails(row),
    },
    {
      label: 'Execute',
      class: 'btn btn-info btn-sm',
      onClick: (row) => this.updateAudit(row.id),
      visible: (row) => row.status === 2 ||  row.status === 4,
    },
    {
      label: 'Start Audit',
      class: 'btn btn-success btn-sm me-2',
      onClick: (row) => this.startAudit(row.id),
      visible: (row) => row.status === 1,
    },
    {
      label: 'Close Audit',
      class: 'btn btn-danger btn-sm me-2',
      onClick: (row) => this.closeAudit(row.id),
      visible: (row) => row.status === 2 ||  row.status === 4,
  },
  {
    label: 'Delete',
    class: 'btn btn-danger btn-sm me-2',
    onClick: (row) => this.deleteAuditPrompt(row),
    visible: (row) => row.status === 1,
  },
  ];

  auditColumns: TableColumn<ReturnAuditDTO>[] = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'plannedDate',
      label: 'Planned Date',
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A',
      sortable: true,
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => this.auditStatusPipe.transform(value),
      sortable: true,
    },
    { 
      key: 'actions', 
      label: 'Actions' 
    }
  ];
  
  audits: ReturnAuditDTO[] = [];
  allMedicines: ReturnMedicineDTO[] = [];

  selectedAudit: ReturnAuditDTO | null = null;

  isModalOpen = false;
  error: string | null = null;
  sortColumn: string = 'plannedDate';
  isDescending: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  filterModel: AuditParams = {
    fromDate: null,
    toDate: null,
    status: null,
    plannedByUserId: null,
    executedByUserId: null,
    notes: null,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'plannedDate',
    isDescending: false,
  };


  constructor(
    private auditService: AuditService,
    private route: ActivatedRoute 
  ) {}
  

  ngOnInit(): void {
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.loadAudits();
  }

  loadAudits(): void {
    const queryParams = {
      ...this.filterModel,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortColumn,
      isDescending: this.isDescending,
    };
  
    this.auditService.getAllAudits(queryParams).subscribe({
      next: (response) => {
        this.audits = response.items || [];
        this.totalItems = response.totalCount || 0;
      },
      error: () => {
        this.error = 'Failed to load audits';
      },
    });
  }
  
  onFilterChange(filters: any): void {
    this.filterModel = {
      ...this.filterModel,
      ...filters
    };
    this.currentPage = 1;
    this.loadAudits();
  }

  onSortChange(sortConfig: { key: keyof ReturnAuditDTO; isDescending: boolean }): void {
    this.sortColumn = sortConfig.key as string;
    this.isDescending = sortConfig.isDescending;
    this.loadAudits();
  }
  
  saveAudit(auditData: CreateAuditDTO): void {
    this.auditService.createAudit(auditData).subscribe({
      next: () => {
        this.loadAudits();
        this.closeCreateAuditModal();
      },
      error: () => (this.error = 'Failed to create audit'),
    });
  }
  
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadAudits();
  }

  openCreateModal(): void {
    this.isModalOpen = true;
  }

  closeCreateAuditModal(): void {
    this.isModalOpen = false;
  }
  
  viewAuditDetails(audit: ReturnAuditDTO): void {
    this.selectedAudit = audit;
  }


  onCloseDetails() : void{
    this.selectedAudit = null;
  }


  onUpdateAuditFromDetails(audit: ReturnAuditDTO) : void{
    this.selectedAudit = null;
    this.updateAudit(audit.id);
  }

  onDeleteAuditFromDetails(audit: ReturnAuditDTO) : void{
    this.selectedAudit = null;
    this.deleteAuditPrompt(audit);
  }
  onStartAuditFromDetails(audit: ReturnAuditDTO) : void{
    this.selectedAudit = null;
    this.startAudit(audit.id)
  }
  onCloseAuditFromDetails(audit: ReturnAuditDTO) : void{
    this.selectedAudit = null;
    this.closeAudit(audit.id)
  }


  getAuditStatusBadgeClass(status: AuditStatus): string {
    const classMap: Record<AuditStatus, string> = {
      [AuditStatus.Planned]: 'bg-secondary',
      [AuditStatus.InProgress]: 'bg-primary',
      [AuditStatus.Completed]: 'bg-success',
      [AuditStatus.RequiresFollowUp]: 'bg-warning text-dark',
      [AuditStatus.Cancelled]: 'bg-danger',
    };
    return classMap[status] ?? 'bg-secondary';
  }


}