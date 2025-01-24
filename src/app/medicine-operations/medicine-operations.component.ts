import { Component, OnInit } from '@angular/core';
import { MedicineRequestService, MedicineUsageService } from '../_services/medicine-ops.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateMedicineRequestDTO, CreateMedicineUsageDTO, MedicineRequestParams, RequestStatus, ReturnMedicineRequestDTO } from '../_models/medicine-operations.types';
import { MedicineService } from '../_services/medicine.service';
import { ReturnMedicineDTO } from '../_models/medicine.types';
import { UserDTO } from '../_models/user.types';
import { AccountService } from '../_services/account.service';
import { TableAction, TableColumn, TableComponent } from '../table/table.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { MedicineOperationsDetailsComponent } from '../medicine-operations-details/medicine-operations-details.component';

@Component({
  selector: 'app-medicine-operations',
  imports: [CommonModule, FormsModule, TableComponent, PaginationComponent, MedicineOperationsDetailsComponent],
  templateUrl: './medicine-operations.component.html',
  styleUrl: './medicine-operations.component.css'
})
export class MedicineOperationsComponent implements OnInit {

  selectedOperation: ReturnMedicineRequestDTO | null = null;

  viewOperationDetails(operation: ReturnMedicineRequestDTO): void {
    this.selectedOperation = operation;
  }

  handleOperationAction(event: { action: string; id: number }): void {
    if (event.action === 'approve') {
      this.approveRequest(event.id);
    } else if (event.action === 'reject') {
      this.rejectRequest(event.id);
    }
    this.selectedOperation = null;
  }



  getRequestStatusText(status: RequestStatus): string {
    const statusMap = {
      [RequestStatus.Pending]: 'Pending',
      [RequestStatus.PedingWithSpecial]: 'Pending With Special',
      [RequestStatus.Approved]: 'Approved',
      [RequestStatus.Rejected]: 'Rejected'
    };
    return statusMap[status] || 'Unknown';
  }

  getStatusBadgeClass(status: RequestStatus): string {
    const classMap = {
      [RequestStatus.Pending]: 'bg-warning',
      [RequestStatus.PedingWithSpecial]: 'bg-info',
      [RequestStatus.Approved]: 'bg-success',
      [RequestStatus.Rejected]: 'bg-danger'
    };
    return classMap[status] || 'bg-secondary';
  }

    onSortChange(sortConfig: { key: keyof ReturnMedicineRequestDTO; isDescending: boolean }): void {
        this.selectedSortBy = sortConfig.key as string;
        this.isDescending = sortConfig.isDescending;
        this.loadRequests();
    }

    tableActions: TableAction<ReturnMedicineRequestDTO>[] = [
    {
        label: 'Approve Request',
        class: 'btn btn-success btn-sm me-2',
        onClick: (row) => this.approveRequest(row.id),
        visible: (row) => row.status === 0
      },
    
    {
        label: 'Reject Request',
        class: 'btn btn-danger btn-sm me-2',
        onClick: (row) => this.rejectRequest(row.id),
        visible: (row) => row.status === 0,
    },
    {
        label: 'Add Usage',
        class: 'btn btn-primary btn-sm',
        onClick: (row) => this.openUsageModal(row),
        visible: (row) => row.status === 2,
    },
    {
      label: 'View Details',
      class: 'btn btn-info btn-sm',
      onClick: (row) => this.viewOperationDetails(row),
    },
  ];

  requestColumns: TableColumn<ReturnMedicineRequestDTO>[] = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'medicine',
      label: 'Medicine',
      render: (value) => value ? `${value.name}` : 'N/A',
      sortable: true,
    },
    {
        key: 'requestedByUser',
        label: 'Requested By',
        render: (value) => value ? `${value.firstName} ${value.lastName}` : 'N/A',
        sortable: true,
    },
    {
        key: 'quantity',
        label: 'Quantity',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => this.getRequestStatusText(value as RequestStatus),
      sortable: true,
    },
    {
      key: 'requiredByDate',
      label: 'Required By',

      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
    { 
      key: 'actions', 
      label: 'Actions' 
    }
  ];





  users: UserDTO[] = [];

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Failed to load users';
        console.error(error);
      }
    });
  }
  ngOnInit(): void {
    this.loadRequests();
    this.loadMedicines();
    this.loadUsers();
  }
  



  requests: ReturnMedicineRequestDTO[] = [];
  medicines: ReturnMedicineDTO[] = []; 
  error: string | null = null;
  
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  
  selectedSortBy = 'requestDate';
  isDescending = false;
  
  isRequestModalOpen = false;
  isUsageModalOpen = false;
  
  filterModel = {
    fromDate: null as Date | null,
    toDate: null as Date | null,
    status: null as RequestStatus | null,
    requestedByUserId: null as number | null,
    medicineId: null as number | null
  };
  
  newRequest: CreateMedicineRequestDTO = {
    medicineId: 0,
    quantity: 0,
    requiredByDate: new Date(),
    justification: ''
  };
  newUsage: CreateMedicineUsageDTO = {
    medicineId: 0,
    medicineRequestId: 0,
    quantity: 0,
    notes: ''
  };

  statuses = Object.entries(RequestStatus)
    .filter(([key]) => !isNaN(Number(key)))
    .map(([key, value]) => ({
      id: Number(key),
      name: this.getRequestStatusText(Number(key))
    }));
  
  constructor(
    private requestService: MedicineRequestService,
    private userService: AccountService,
    private usageService: MedicineUsageService,
    private medicineService: MedicineService
  ) {}
  

  
  filtersVisible: boolean = false;

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }
  
  loadRequests(): void {
    const filterModel: MedicineRequestParams = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.selectedSortBy,
      isDescending: this.isDescending,
      fromDate: this.filterModel.fromDate,
      toDate: this.filterModel.toDate,
      status: this.filterModel.status,
      requestedByUserId: this.filterModel.requestedByUserId,
      medicineId: this.filterModel.medicineId
    };
  
    this.requestService.getRequests(filterModel).subscribe({
      next: (response) => {
        this.requests = response.items;
        this.totalItems = response.totalCount;
      },
      error: () => (this.error = 'Failed to load requests')
    });
  }
  

  loadMedicines(): void {
    this.medicineService.getMedicines({ 
      pageNumber: 1, 
      pageSize: 999, 
      sortBy: 'name' 
    }).subscribe({
      next: (response) => this.medicines = response.items,
      error: () => this.error = 'Failed to load medicines'
    });
  }
  
  
  getSortIcon(column: string): string {
    if (this.selectedSortBy !== column) return 'bi bi-chevron-expand';
    return this.isDescending ? 'bi bi-chevron-down' : 'bi bi-chevron-up';
  }
  
  applyFilters(): void {
    this.currentPage = 1;
    this.loadRequests();
  }
  
  resetFilters(): void {
    
    this.filterModel = {
      fromDate: null,
      toDate: null,
      status: null,
      requestedByUserId: null,
      medicineId: null
    };
    this.applyFilters();
  }
  
  openRequestModal(): void {
    this.resetRequestForm();
    this.isRequestModalOpen = true;
  }
  
  closeRequestModal(): void {
    this.isRequestModalOpen = false;
  }
  
  openUsageModal(request: ReturnMedicineRequestDTO): void {
    this.newUsage = {
      medicineId: request.medicine.id,
      medicineRequestId: request.id,
      quantity: 0,
      notes: ''
    };
    this.isUsageModalOpen = true;
  }
  
  closeUsageModal(): void {
    this.isUsageModalOpen = false;
  }
  
  resetRequestForm(): void {
    this.newRequest = {
      medicineId: 0,
      quantity: 0,
      requiredByDate: new Date(),
      justification: ''
    };
  }
  
  saveRequest(): void {
    this.requestService.createRequest(this.newRequest).subscribe({
      next: () => {
        this.loadRequests();
        this.closeRequestModal();
      },
      error: () => (this.error = 'Failed to create request')
    });
  }
  
  
  saveUsage(): void {
    this.usageService.createUsage(this.newUsage).subscribe({
      next: () => {
        this.loadRequests();
        this.closeUsageModal();
      },
      error: () => (this.error = 'Failed to create usage')
    });
  }
  
  
  approveRequest(requestId: number): void {
    this.requestService.approveRequest(requestId).subscribe({
      next: () => this.loadRequests(),
      error: () => this.error = 'Failed to approve request'
    });
  }
  
  rejectRequest(requestId: number): void {
    this.requestService.rejectRequest(requestId).subscribe({
      next: () => this.loadRequests(),
      error: () => this.error = 'Failed to reject request'
    });
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRequests();
  }
  
  
  
  get totalPages(): number[] {
    const pages = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: pages }, (_, i) => i + 1);
  }
}