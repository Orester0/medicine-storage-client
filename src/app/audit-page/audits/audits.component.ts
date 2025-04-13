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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-audits',
  imports: [
    AuditNotesComponent, 
    DeleteConfirmationModalComponent, 
    CreateAuditFormComponent, 
    CommonModule, 
    AuditsDetailsComponent, 
    TableComponent, 
    PaginationComponent, 
    ReactiveFormsModule, 
    FilterComponent, 
    AuditUpdateItemsComponent
  ],
  providers: [AuditStatusPipe, UserFullNamePipe],
  templateUrl: './audits.component.html',
  styleUrl: './audits.component.css'
})
export class AuditsComponent implements OnInit {
  private auditService = inject(AuditService);
  private auditStatusPipe = inject(AuditStatusPipe);
  private userFullNamePipe = inject(UserFullNamePipe);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);

  tableAudits: ReturnAuditDTO[] = [];
  allMedicines: ReturnMedicineDTO[] = [];
  allUsers: ReturnUserGeneralDTO[] = [];
  totalItems: number = 0;
  
  isCreateAuditModalOpen = false;
  selectedAudit: ReturnAuditDTO | null = null;
  auditToStart: ReturnAuditDTO | null = null;
  auditToClose: ReturnAuditDTO | null = null;
  auditToUpdate: ReturnAuditDTO | null = null;
  auditToDelete: ReturnAuditDTO | null = null;

  auditParams: AuditParams = {
    pageNumber: 1,
    pageSize: 10,
    isDescending: false
  };

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
      visible: (row) => row.status === 2,
    },
    {
      label: 'Start Audit',
      icon: 'play_circle',
      class: 'btn btn-success btn-sm',
      onClick: (row) => this.startAudit(row.id),
      visible: (row) => row.status === 1,
    },
    {
      label: 'Close Audit',
      icon: 'stop_circle',
      class: 'btn btn-danger btn-sm',
      onClick: (row) => this.closeAudit(row.id),
      visible: (row) => row.status === 2,
    },
    {
      label: 'Delete',
      icon: 'delete',
      class: 'btn btn-danger btn-sm',
      onClick: (row) => this.deleteAuditPrompt(row),
      visible: (row) => {
        const userId = this.authService.currentUser()?.id; 
        const isAdmin = this.authService.userHasRole(['Admin']);
        const isCreator = row.plannedByUser!.id === userId;
        return row.status === 1 && (isAdmin || isCreator);
      },
    },
  ];

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
      key: 'statuses',
      label: 'Status',
      type: 'select',
      multiselect: true,
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

  ngOnInit(): void {
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.allUsers = this.route.snapshot.data['users'];
    this.initializeFilter();
    // this.loadAudits();
  }

  private initializeFilter(): void {
    const userOptions = this.allUsers.map(user => ({
      value: user.id,
      label: this.userFullNamePipe.transform(user)
    }));
    
    this.filterConfig[4].options = userOptions;
    this.filterConfig[5].options = userOptions;
    this.filterConfig[6].options = userOptions;
  }

  loadAudits(): void {
    this.auditService.getAuditsWithFilters(this.auditParams).subscribe({
      next: (response) => {
        this.tableAudits = response.items || [];
        this.totalItems = response.totalCount || 0;
        this.selectedAudit = null;
      }
    });
  }

  openCreateModal(): void {
    this.isCreateAuditModalOpen = true;
  }

  closeCreateAuditModal(): void {
    this.isCreateAuditModalOpen = false;
  }

  saveAudit(auditData: CreateAuditDTO): void {
    this.auditService.createAudit(auditData).subscribe({
      next: () => {
        this.loadAudits();
        this.closeCreateAuditModal();
        this.toastr.success('Audit created successfully');
      }
    });
  }

  viewAuditDetails(audit: ReturnAuditDTO): void {
    this.selectedAudit = audit;
  }

  onCloseDetails(): void {
    this.selectedAudit = null;
  }

  startAudit(id: number): void {
    const audit = this.tableAudits.find(a => a.id === id);
    if (audit) this.auditToStart = audit;
  }

  closeAudit(id: number): void {
    const audit = this.tableAudits.find(a => a.id === id);
    if (audit) this.auditToClose = audit;
  }

  updateAudit(id: number): void {
    const audit = this.tableAudits.find(a => a.id === id);
    if (audit) this.auditToUpdate = audit;
  }

  handleStartSubmit(data: { note: string }): void {
    if (!this.auditToStart) return;
    
    this.auditService.startAudit(this.auditToStart.id, { note: data.note }).subscribe({
      next: () => {
        this.loadAudits();
        this.auditToStart = null;
        this.toastr.success('Audit has been started');
      }
    });
  }

  handleCloseSubmit(data: { note: string }): void { 
    if (!this.auditToClose) return;

    this.auditService.closeAudit(this.auditToClose.id, { note: data.note }).subscribe({
      next: () => {
        this.loadAudits();
        this.auditToClose = null;
        this.toastr.success('Audit has been closed');
      }
    });
  }

  handleUpdateSubmit(data: UpdateAuditItemsRequest): void {
    if (!this.auditToUpdate) return;

    this.auditService.updateAuditItems(this.auditToUpdate.id, data).subscribe({
      next: () => {
        this.loadAudits();
        this.auditToUpdate = null;
        this.toastr.success('Audit has been updated');
      },
      error: () => console.error('Failed to update audit items'),
    });
  }

  deleteAuditPrompt(audit: ReturnAuditDTO): void {
    this.auditToDelete = audit;
  }

  handleDeleteConfirm(): void {
    if (!this.auditToDelete) return;
    
    this.auditService.deleteAudit(this.auditToDelete.id).subscribe({
      next: () => {
        this.loadAudits();
        this.auditToDelete = null;
        this.toastr.success('Audit has been deleted');
      },
      error: () => {
        console.error('Failed to delete audit.');
      },
    });
  }

  handleDeleteCancel(): void {
    this.auditToDelete = null;
  }

  onUpdateAuditFromDetails(audit: ReturnAuditDTO): void {
    this.selectedAudit = null;
    this.updateAudit(audit.id);
  }

  onDeleteAuditFromDetails(audit: ReturnAuditDTO): void {
    this.selectedAudit = null;
    this.deleteAuditPrompt(audit);
  }

  onStartAuditFromDetails(audit: ReturnAuditDTO): void {
    this.selectedAudit = null;
    this.startAudit(audit.id);
  }

  onCloseAuditFromDetails(audit: ReturnAuditDTO): void {
    this.selectedAudit = null;
    this.closeAudit(audit.id);
  }

  getAuditStatusBadgeClass(status: AuditStatus): string {
    const classMap: Record<AuditStatus, string> = {
      [AuditStatus.Planned]: 'bg-secondary',
      [AuditStatus.InProgress]: 'bg-primary',
      [AuditStatus.SuccesfullyCompleted]: 'bg-success',
      [AuditStatus.CompletedWithProblems]: 'bg-warning text-dark',
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
}