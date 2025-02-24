import { Component, inject, OnInit } from '@angular/core';
import { ReturnAuditDTO, AuditParams, AuditStatus, CreateAuditDTO, UpdateAuditItemsRequest } from '../../_models/audit.types';
import { AuditService } from '../../_services/audit.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuditsDetailsComponent } from '../audits-details/audits-details.component';
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
import { UserFullNamePipe } from '../../_pipes/user-full-name.pipe';
import { ReturnUserGeneralDTO } from '../../_models/user.types';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-audits',
  imports: [AuditNotesComponent, DeleteConfirmationModalComponent, CreateAuditFormComponent, CommonModule, AuditsDetailsComponent, TableComponent, PaginationComponent, ReactiveFormsModule, FilterComponent, AuditUpdateItemsComponent],
  providers: [AuditStatusPipe, UserFullNamePipe],
  templateUrl: './audits.component.html',
  styleUrl: './audits.component.css'
})
export class AuditsComponent implements OnInit {
  auditStatusPipe = inject(AuditStatusPipe);
  userFullNamePipe = inject(UserFullNamePipe);
  authService = inject(AuthService)


  // handle delete

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



  isCreateAuditModalOpen = false;


  


  


  
  
  audits: ReturnAuditDTO[] = [];
  allMedicines: ReturnMedicineDTO[] = [];
  allUsers: ReturnUserGeneralDTO[] = [];

  selectedAudit: ReturnAuditDTO | null = null;

  error: string | null = null;
  totalItems: number = 0;

  tableActions: TableAction<ReturnAuditDTO>[] = [
    {
      label: 'View Details',
      icon: 'visibility',
      class: 'btn btn-info btn-sm',
      onClick: (row) => this.viewAuditDetails(row),
    },
    {
      label: 'Execute',
      icon: 'play_arrow', 
      class: 'btn btn-info btn-sm',
      onClick: (row) => this.updateAudit(row.id),
      visible: (row) => row.status === 2 ||  row.status === 4,
    },
    {
      label: 'Start Audit',
      icon: 'play_circle',
      class: 'btn btn-success btn-sm me-2',
      onClick: (row) => this.startAudit(row.id),
      visible: (row) => row.status === 1,
    },
    {
      label: 'Close Audit',
      icon: 'stop_circle',
      class: 'btn btn-danger btn-sm me-2',
      onClick: (row) => this.closeAudit(row.id),
      visible: (row) => row.status === 2 ||  row.status === 4,
  },
  {
    label: 'Delete',
    icon: 'delete',
    class: 'btn btn-danger btn-sm me-2',
    onClick: (row) => this.deleteAuditPrompt(row),
    visible: (row) => {
      const userId = this.authService.currentUser()?.id; 
      const isAdmin = this.authService.userHasRole(['Admin']);
      const isCreator = row.plannedByUser!.id === userId;
      return row.status === 1 && (isAdmin || isCreator);
    },
  },
  ];

  


  auditColumns: TableColumn<ReturnAuditDTO>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
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

  
  

  auditParams: AuditParams = {
    pageNumber: 1,
    pageSize: 10,
    isDescending: false
  };


  constructor(
    private auditService: AuditService,
    private route: ActivatedRoute 
  ) {}
  

  ngOnInit(): void {
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.allUsers = this.route.snapshot.data['users'];
    this.initializeFilter();
    // this.loadAudits();
  }

  
  filterConfig: FilterConfig[] = [
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      col: 6
    },
    {
      key: 'fromPlannedDate',
      label: 'Planned From Date',
      type: 'date',
    },
    {
      key: 'toPlannedDate',
      label: 'Planned To Date',
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
      label: 'Planned By User',
      type: 'select',
      options: []
    },
    {
      key: 'closedByUserId',
      label: 'Closed By User',
      type: 'select',
      options: []
    },
    {
      key: 'executedByUserId',
      label: 'Executed By User',
      type: 'select',
      options: []
    }
    
  ];
  
  private initializeFilter(): void {
    this.filterConfig[4].options = this.allUsers.map(user => ({
      value: user.id,
      label: this.userFullNamePipe.transform(user)
    }))
  
    this.filterConfig[5].options = this.allUsers.map(user => ({
      value: user.id,
      label: this.userFullNamePipe.transform(user)
    }))
  
    this.filterConfig[6].options = this.allUsers.map(user => ({
      value: user.id,
      label: this.userFullNamePipe.transform(user)
    }))
  }
  

  loadAudits(): void {

    this.auditService.getAuditsWithFilters(this.auditParams).subscribe({
      next: (response) => {
        this.audits = response.items || [];
        this.totalItems = response.totalCount || 0;
        this.selectedAudit = null;
      },
      error: () => {
        this.error = 'Failed to load audits';
      },
    });
  }

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
  
  saveAudit(auditData: CreateAuditDTO): void {
    this.auditService.createAudit(auditData).subscribe({
      next: () => {
        this.loadAudits();
        this.closeCreateAuditModal();
      },
      error: () => (this.error = 'Failed to create audit'),
    });
  }

  

  closeCreateAuditModal(): void {
    this.isCreateAuditModalOpen = false;
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

  

  onFilterChange(filters: Partial<AuditParams>): void {
    this.auditParams = { 
      ...this.auditParams, 
      ...filters, 
      pageNumber: 1 
    };
    this.loadAudits();
  }

  onSortChange(sort: { key: keyof ReturnAuditDTO; isDescending: boolean }): void {
    this.auditParams.sortBy = sort.key as string;
    this.auditParams.isDescending = sort.isDescending;
    this.loadAudits();
  }
  
  
  onPageChange(page: number): void {
    this.auditParams.pageNumber = page;
    this.loadAudits();
  }

  openCreateModal(): void {
    this.isCreateAuditModalOpen = true;
  }


}