import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MedicineRequestService } from '../../_services/medicine-request.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateMedicineRequestDTO, MedicineRequestParams, RequestStatus, ReturnMedicineRequestDTO } from '../../_models/medicine-request.types';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { ReturnUserGeneralDTO } from '../../_models/user.types';
import { TableAction, TableColumn, TableComponent } from '../../table/table.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { MedicineOperationsDetailsComponent } from '../medicine-request-details/medicine-request-details.component';
import { FilterComponent, FilterConfig } from '../../filter/filter.component';
import { CreateMedicineRequestFormComponent } from '../create-medicine-request-form/create-medicine-request-form.component';
import { ActivatedRoute } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../delete-confirmation-modal/delete-confirmation-modal.component';
import { RequestStatusPipe } from '../../_pipes/request-status.pipe';
import { UserFullNamePipe } from '../../_pipes/user-full-name.pipe';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-medicine-operations',
  imports: [DeleteConfirmationModalComponent, CreateMedicineRequestFormComponent ,FilterComponent, CommonModule, TableComponent, PaginationComponent, MedicineOperationsDetailsComponent, ReactiveFormsModule],
  providers: [RequestStatusPipe, UserFullNamePipe, MedicineNamePipe],
  templateUrl: './medicine-request.component.html',
  styleUrl: './medicine-request.component.css'
})
export class MedicineRequestComponent implements OnInit {
  
  requestStatusPipe = inject(RequestStatusPipe);
  userFullNamePipe = inject(UserFullNamePipe);
  medicineNamePipe = inject(MedicineNamePipe);
  authService = inject(AuthService);
  toastr = inject(ToastrService);


  requests: ReturnMedicineRequestDTO[] = [];
  allMedicines: ReturnMedicineDTO[] = []; 
  error: string | null = null;
  
  sortColumn = 'requestDate';
  isDescending: boolean = false;
  
  isCreateRequestModalOpen = false;

  hasRole(roles: string[]): boolean {
    return roles.some(role => this.authService.userHasRole([role]));
  }

  tableActions: TableAction<ReturnMedicineRequestDTO>[] = [
    {
        label: 'Approve Request',
        icon: 'check_circle',
        class: 'btn btn-success btn-sm me-2',
        onClick: (row) => this.approveRequest(row.id),
        visible: (row) => (row.status === 1 || row.status === 2) && this.hasRole(['Admin', 'Manager']),
      },
    
    {
        label: 'Reject Request',
        icon: 'cancel',
        class: 'btn btn-danger btn-sm me-2',
        onClick: (row) => this.rejectRequest(row.id),
        visible: (row) => (row.status === 1 || row.status === 2) && this.hasRole(['Admin', 'Manager']),
    },
    {
      label: 'View Details',
      icon: 'visibility',
      class: 'btn btn-info btn-sm',
      onClick: (row) => this.viewOperationDetails(row),
    },
    {
      label: 'Delete',
      icon: 'delete',
      class: 'btn btn-danger btn-sm me-2',
      onClick: (row) => this.deleteTenderPrompt(row),
      visible: (row) => {
        const userId = this.authService.currentUser()?.id; 
        const isAdmin = this.authService.userHasRole(['Admin']);
        const isCreator = row.requestedByUser!.id === userId;
        return (row.status === 1 || row.status === 2) && (isAdmin || isCreator);
      },
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
          this.toastr.success('Request has been deleted');
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
      sortable: true,
    },
    {
      key: 'medicine',
      label: 'Medicine',
      render: (value) => this.medicineNamePipe.transform(value),
      sortable: true,
    },
    {
      key: 'requestedByUser',
      label: 'Requested By',
      render: (value) => this.userFullNamePipe.transform(value),
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





  users: ReturnUserGeneralDTO[] = [];
  filterConfig: FilterConfig[] = [
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
      })),
      defaultValue: this.authService.userHasRole(['doctor']) ? this.authService.currentUser()?.id : null
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: Object.values(RequestStatus)
            .filter(status => typeof status === 'number') 
            .map(status => ({
              value: status as RequestStatus,
              label: this.requestStatusPipe.transform(status)
            })),
      defaultValue: this.authService.userHasRole(['manager']) ? RequestStatus.Pending : null
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

  

  requestParams: MedicineRequestParams = {
    pageNumber: 1,
    pageSize: 10,
    isDescending: false,
  };
  
  
  constructor(
    private requestService: MedicineRequestService,
    private route: ActivatedRoute
  ) {}
  
  private initializeFilter(): void {
    this.filterConfig[0].options = this.allMedicines.map(medicine => ({
      value: medicine.id,
      label: medicine.name
    }))
  
    this.filterConfig[1].options = this.users.map(user => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`
    }))
  }

  
  ngOnInit(): void {
    this.users = this.route.snapshot.data['users'];
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.initializeFilter();
    // this.loadRequests();
  }

  totalItems = 0;

  loadRequests(): void {
    this.requestService.getRequestsWithFilters(this.requestParams).subscribe({
      next: (response) => {
        this.requests = response.items;
        this.totalItems = response.totalCount;
        this.selectedRequest = null;
      },
      error: () => {
        this.error = 'Failed to load requests'
      },
    });
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

    

  openCreateRequestModal(): void {
    this.isCreateRequestModalOpen = true;
  }   
  
  closeCreateRequestModal(): void {
    this.isCreateRequestModalOpen = false;
  }
  
  saveRequest(requestData: CreateMedicineRequestDTO): void {
    this.requestService.createRequest(requestData).subscribe({
      next: () => {
        this.toastr.success('Request created succesfully');
        this.loadRequests();
        this.closeCreateRequestModal();
      },
      error: () => (this.error = 'Failed to create request')
    });
  }
  
  
  
  approveRequest(requestId: number): void {
    this.requestService.approveRequest(requestId).subscribe({
      next: () => {
        this.toastr.success('Request has been approved');
        this.loadRequests()
      },
      error: () => this.error = 'Failed to approve request'
    });
  }
  
  rejectRequest(requestId: number): void {
    this.requestService.rejectRequest(requestId).subscribe({
      next: () => {
        this.toastr.success('Request has been rejected');
        this.loadRequests()
      },
      error: () => this.error = 'Failed to reject request'
    });
  }

  
  
  onPageChange(page: number): void {
    this.requestParams.pageNumber = page;
    this.loadRequests();
  }
  onFilterChange(filters: any): void {
    this.requestParams = {
      ...this.requestParams,
      ...filters,
      pageNumber: 1 
    };
    this.loadRequests();
  }
  onSortChange(sortConfig: { key: keyof ReturnMedicineRequestDTO; isDescending: boolean }): void {
    this.sortColumn = sortConfig.key as string;
    this.isDescending = sortConfig.isDescending;
    this.loadRequests();
}
  
  
}