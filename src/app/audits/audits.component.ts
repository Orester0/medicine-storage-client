import { Component, OnInit } from '@angular/core';
import { ReturnAuditDTO, AuditParams, AuditStatus, CreateAuditRequest } from '../_models/audit.types';
import { AuditService } from '../_services/audit.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuditsDetailsComponent } from '../audits-details/audits-details.component';
import { MedicineService } from '../_services/medicine.service';
import { ReturnMedicineDTO } from '../_models/medicine.types';
import { TableAction, TableColumn, TableComponent } from '../table/table.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-audits',
  imports: [FormsModule, CommonModule, AuditsDetailsComponent, TableComponent, PaginationComponent],
  templateUrl: './audits.component.html',
  styleUrl: './audits.component.css'
})
export class AuditsComponent implements OnInit {

  getAuditStatusText(status: AuditStatus): string {
    const statusMap: Record<AuditStatus, string> = {
      [AuditStatus.Planned]: 'Planned',
      [AuditStatus.InProgress]: 'In Progress',
      [AuditStatus.Completed]: 'Completed',
      [AuditStatus.RequiresFollowUp]: 'Requires Follow-Up',
      [AuditStatus.Cancelled]: 'Cancelled',
    };
    return statusMap[status] ?? 'Unknown';
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
  

  onSortChange(sortConfig: { key: keyof ReturnAuditDTO; isDescending: boolean }): void {
    this.sortColumn = sortConfig.key as string;
    this.isDescending = sortConfig.isDescending;
    this.loadAudits();
  }
  
  tableActions: TableAction<ReturnAuditDTO>[] = [
    // {
    //   label: 'Delete',
    //   class: 'btn btn-danger btn-sm me-2',
    //   onClick: (row) => this.deleteAuditPrompt(row),
    //   visible: (row) => row.status === 'Planned',
    // },
    {
      label: 'View Details',
      class: 'btn btn-info btn-sm',
      onClick: (row) => this.viewAuditDetails(row),
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
      render: (value) => this.getAuditStatusText(value as AuditStatus),
      sortable: true,
    },
    { 
      key: 'actions', 
      label: 'Actions' 
    }
  ];
  
  

  audits: ReturnAuditDTO[] = [];
  medicines: ReturnMedicineDTO[] = [];
  selectedMedicines: number[] = [];
  statusList = Object.values(AuditStatus);

  selectedAudit: ReturnAuditDTO | null = null;

  newAudit: CreateAuditRequest = {
    medicineIds: [],
    notes: '',
    plannedDate: new Date()
  };

  isModalOpen = false;
  error: string | null = null;

  sortColumn: string = 'plannedDate';
  isDescending: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(
    private auditService: AuditService,
    private medicineService: MedicineService
  ) {}

  ngOnInit(): void {
    this.loadAudits();
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.medicineService.getMedicines({ 
      pageNumber: 1, 
      pageSize: 999, 
      sortBy: 'name' 
    }).subscribe({
      next: (response) => {
        this.medicines = response.items;
      },
      error: () => {
        this.error = 'Failed to load medicines';
      }
    });
  }


  filtersVisible: boolean = false;

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

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
  
  
  applyFilters(): void {
    this.currentPage = 1;
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


  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadAudits();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }


  saveAudit(): void {
    if (this.selectedAudit) {
      this.auditService.updateAudit(this.selectedAudit.id, this.selectedAudit).subscribe({
        next: () => {
          this.loadAudits();
          this.closeModal();
          this.selectedAudit = null;
        },
        error: () => (this.error = 'Failed to update audit'),
      });
    } else {
      this.newAudit.medicineIds = this.selectedMedicines;
      this.auditService.createAudit(this.newAudit).subscribe({
        next: () => {
          this.loadAudits();
          this.closeModal();
        },
        error: () => (this.error = 'Failed to create audit'),
      });
    }
  }

  toggleMedicine(id: number): void {
    const index = this.selectedMedicines.indexOf(id);
    if (index === -1) {
      this.selectedMedicines.push(id);
    } else {
      this.selectedMedicines.splice(index, 1);
    }
  }

  selectAllMedicines(): void {
    if (this.selectedMedicines.length === this.medicines.length) {
      this.selectedMedicines = [];
    } else {
      this.selectedMedicines = this.medicines.map(m => m.id);
    }
  }

  openCreateModal(): void {
    this.resetForm();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }
  
  resetForm(): void {
    this.newAudit = {
      medicineIds: [],
      notes: '',
      plannedDate: new Date()
    };
    this.selectedMedicines = [];
    this.selectedAudit = null;
  }

  viewAuditDetails(audit: ReturnAuditDTO): void {
    this.selectedAudit = audit;
  }

  onEditFromDetails(audit: ReturnAuditDTO): void {
    this.selectedAudit = { ...audit };
    this.isModalOpen = true;
  }
}