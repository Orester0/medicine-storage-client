import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MedicineRequestService } from '../../_services/medicine-ops.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateMedicineRequestDTO, CreateMedicineUsageDTO, MedicineRequestParams, RequestStatus, ReturnMedicineRequestDTO } from '../../_models/medicine-operations.types';
import { MedicineService } from '../../_services/medicine.service';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { ReturnUserDTO } from '../../_models/user.types';
import { UserService } from '../../_services/user.service';
import { TableAction, TableColumn, TableComponent } from '../../table/table.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { MedicineOperationsDetailsComponent } from '../medicine-request-details/medicine-request-details.component';
import { FilterComponent, FilterConfig } from '../../filter/filter.component';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { CreateMedicineRequestFormComponent } from '../create-medicine-request-form/create-medicine-request-form.component';
import { ActivatedRoute } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../delete-confirmation-modal/delete-confirmation-modal.component';
import { RequestStatusPipe } from '../../_pipes/request-status.pipe';

@Component({
  selector: 'app-medicine-operations',
  imports: [DeleteConfirmationModalComponent, CreateMedicineRequestFormComponent ,FilterComponent, CommonModule, FormsModule, TableComponent, PaginationComponent, MedicineOperationsDetailsComponent, ReactiveFormsModule],
  providers: [RequestStatusPipe],
  templateUrl: './medicine-request.component.html',
  styleUrl: './medicine-request.component.css'
})
export class MedicineRequestComponent implements OnInit {
  
  requestStatusPipe = inject(RequestStatusPipe);


  requests: ReturnMedicineRequestDTO[] = [];
  allMedicines: ReturnMedicineDTO[] = []; 
  error: string | null = null;
  
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  
  sortColumn = 'requestDate';
  isDescending: boolean = false;
  
  isCreateRequestModalOpen = false;
  isUsageModalOpen = false;

  tableActions: TableAction<ReturnMedicineRequestDTO>[] = [
    {
        label: 'Approve Request',
        class: 'btn btn-success btn-sm me-2',
        onClick: (row) => this.approveRequest(row.id),
        visible: (row) => row.status === 1 || row.status === 2,
      },
    
    {
        label: 'Reject Request',
        class: 'btn btn-danger btn-sm me-2',
        onClick: (row) => this.rejectRequest(row.id),
        visible: (row) => row.status === 1 || row.status === 2,
    },
    {
      label: 'View Details',
      class: 'btn btn-info btn-sm',
      onClick: (row) => this.viewOperationDetails(row),
    },
    {
      label: 'Delete',
      class: 'btn btn-danger btn-sm me-2',
      onClick: (row) => this.deleteTenderPrompt(row),
      visible: (row) =>  row.status === 1 || row.status === 2
    },
  ];

  
    requestToDelete: ReturnMedicineRequestDTO | null = null;
  
    deleteTenderPrompt(request: ReturnMedicineRequestDTO): void {
      this.requestToDelete = request;
    }
  
    handleDeleteConfirm(): void {
      if (!this.requestToDelete) return;
      this.requestService.deleteRequest(this.requestToDelete.id).subscribe({
        next: () => {
          this.loadRequests();
          this.requestToDelete = null;
        },
        error: () => {
          console.error('Failed to delete request.');
        },
      });
    }
  
    handleDeleteCancel(): void {
      this.requestToDelete = null;
    }

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
      key: 'status',
      label: 'Status',
      render: (value) => this.requestStatusPipe.transform(value),
      sortable: true,
    },
    {
        key: 'quantity',
        label: 'Quantity',
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





  users: ReturnUserDTO[] = [];
  filterConfig: FilterConfig[] = [
    
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: Object.values(RequestStatus)
            .filter(status => typeof status === 'number') 
            .map(status => ({
              value: status as RequestStatus,
              label: this.requestStatusPipe.transform(status)
            }))
    },
    {
      key: 'fromDate',
      label: 'Required from date',
      type: 'date'
    },
    {
      key: 'toDate',
      label: 'Required to date',
      type: 'date'
    },
    
  ];

  selectedRequest: ReturnMedicineRequestDTO | null = null;

  

  filterModel = {
    fromDate: null as Date | null,
    toDate: null as Date | null,
    status: null as RequestStatus | null,
    requestedByUserId: null as number | null,
    medicineId: null as number | null,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'plannedDate',
    isDescending: false,
  };
  
  
  constructor(
    private requestService: MedicineRequestService,
    private route: ActivatedRoute
  ) {}
  
  private initializeFilter(): void {
    this.filterConfig = [
      {
        key: 'medicineId',
        label: 'Medicine',
        type: 'select',
        options: this.allMedicines.map(medicine => ({
          value: medicine.id,
          label: medicine.name
        }))
      },
      {
        key: 'requestedByUserId',
        label: 'Requested By',
        type: 'select',
        options: this.users.map(user => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName}`
        }))
      },
      ...this.filterConfig,
    ];
  }

  
  ngOnInit(): void {
    this.users = this.route.snapshot.data['users'];
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.initializeFilter();
    this.loadRequests();
  }

  loadRequests(): void {
    const filterModel: MedicineRequestParams = {
      ...this.filterModel,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortColumn,
      isDescending: this.isDescending,
    };

    this.requestService.getRequests(filterModel).subscribe({
      next: (response) => {
        this.requests = response.items;
        this.totalItems = response.totalCount;
      },
      error: () => {
        this.error = 'Failed to load requests'
      },
    });
  }

 
  onFilterChange(filters: any): void {
    this.filterModel = {
      ...this.filterModel,
      ...filters
    };
    this.currentPage = 1;
    this.loadRequests();
  }

  


  viewOperationDetails(request: ReturnMedicineRequestDTO): void {
    this.selectedRequest = request;
  }

  onApproveFromDetails(requestId: number) : void {
    this.approveRequest(requestId);
    this.selectedRequest = null;
  }

  onRejectFromDetails(requestId: number) : void {
    this.approveRequest(requestId);
    this.selectedRequest = null;
  }

    onSortChange(sortConfig: { key: keyof ReturnMedicineRequestDTO; isDescending: boolean }): void {
        this.sortColumn = sortConfig.key as string;
        this.isDescending = sortConfig.isDescending;
        this.loadRequests();
    }


  openCreateRequestModal(): void {
    this.isCreateRequestModalOpen = true;
  }   
  
  closeCreateRequestModal(): void {
    this.isCreateRequestModalOpen = false;
  }
  
  saveRequest(requestData: CreateMedicineRequestDTO): void {
    this.requestService.createRequest(requestData).subscribe({
      next: () => {
        this.loadRequests();
        this.closeCreateRequestModal();
      },
      error: () => (this.error = 'Failed to create request')
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
  
  

  getRequestStatusBadgeClass(status: RequestStatus): string {
    const classMap = {
      [RequestStatus.Pending]: 'bg-warning',
      [RequestStatus.PedingWithSpecial]: 'bg-info',
      [RequestStatus.Approved]: 'bg-success',
      [RequestStatus.Rejected]: 'bg-danger'
    };
    return classMap[status] || 'bg-secondary';
  }
  
}