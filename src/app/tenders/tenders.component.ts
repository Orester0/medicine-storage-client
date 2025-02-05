import { Component, OnInit } from '@angular/core';
import { CreateTenderDTO, CreateTenderItem, ReturnTenderDTO, TenderStatus } from '../_models/tender.types';
import { TenderService } from '../_services/tender.service';
import { TendersDetailsComponent } from '../tenders-details/tenders-details.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicineService } from '../_services/medicine.service';
import { ReturnMedicineDTO } from '../_models/medicine.types';
import { TableAction, TableColumn, TableComponent } from '../table/table.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FilterComponent, FilterConfig } from '../filter/filter.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.css'],
  imports: [FilterComponent, TendersDetailsComponent, FormsModule, CommonModule, TableComponent, PaginationComponent, ReactiveFormsModule]
})
export class TendersComponent implements OnInit {
  tableActions: TableAction<ReturnTenderDTO>[] = [
    {
        label: 'View Details',
        class: 'btn btn-info btn-sm',
        onClick: (row) => this.viewTenderDetails(row),
      },
    
    {
        label: 'Publish Tender',
        class: 'btn btn-success btn-sm me-2',
        onClick: (row) => this.publishTender(row.id),
        visible: (row) => row.status === 1,
    },
    {
        label: 'Add Item',
        class: 'btn btn-primary btn-sm me-2',
        onClick: (row) => this.openAddItemModal(row.id),
        visible: (row) => row.status === 1,
    },
    {
        label: 'Close Tender',
        class: 'btn btn-danger btn-sm me-2',
        onClick: (row) => this.closeTender(row.id),
        visible: (row) => row.status === 2,
    },
  ];

  tenderColumns: TableColumn<ReturnTenderDTO>[] = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => this.getTenderStatusText(value as TenderStatus),
      sortable: true,
    },
    {
        key: 'deadlineDate',
        label: 'Deadline',
      render: (value) => new Date(value).toLocaleDateString(),
        sortable: true,
    },
    { 
      key: 'actions', 
      label: 'Actions' 
    }
  ];

  createTenderForm!: FormGroup;

  tenders: ReturnTenderDTO[] = [];
  allMedicines: ReturnMedicineDTO[] = [];
  selectedTender: ReturnTenderDTO | null = null;
  selectedTenderId: number | null = null;
  error: string | null = null;

  isCreateTenderModalOpen = false;
  isTenderItemModalOpen = false;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  sortColumn = 'title';
  isDescending = false;

  filterConfig: FilterConfig[] = [
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      col: 3
    },
    {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: Object.values(TenderStatus)
          .filter(status => typeof status === 'number') 
          .map(status => ({
            value: status as TenderStatus,
            label: this.getTenderStatusText(status as TenderStatus)
          }))
        },
    {
      key: 'publishDateFrom',
      label: 'Publish Date From',
      type: 'date',
      col: 3
    },
    {
      key: 'publishDateTo',
      label: 'Publish Date To',
      type: 'date',
      col: 3
    },
    {
      key: 'closingDateFrom',
      label: 'Closing Date From',
      type: 'date',
      col: 3
    },
    {
      key: 'closingDateTo',
      label: 'Closing Date To',
      type: 'date',
      col: 3
    },
    {
      key: 'deadlineDateFrom',
      label: 'Deadline Date From',
      type: 'date',
      col: 3
    },
    {
      key: 'deadlineDateTo',
      label: 'Deadline Date To',
      type: 'date',
      col: 3
    }
  ];

  filterModel = {
    title: '',
    publishDateFrom: null as Date | null,
    publishDateTo: null as Date | null,
    status: null as TenderStatus | null,
    closingDateFrom: null as Date | null,
    closingDateTo: null as Date | null,
    deadlineDateFrom: null as Date | null,
    deadlineDateTo: null as Date | null
  };

  newTenderItem: CreateTenderItem = {
      tenderId: 0,
      medicineId: 0,
      requiredQuantity: 0
  };

  constructor(
    private fb: FormBuilder,
      private tenderService: TenderService,
      private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
      this.allMedicines = this.route.snapshot.data['medicines'];
      this.loadTenders();
      this.initializeForm();
  }

  
  private loadTenders(): void {
    const queryParams = {
      ...this.filterModel,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortColumn,
      isDescending: this.isDescending
    };

    
    this.tenderService.getTenders(queryParams).subscribe({
      next: (response) => {
        this.tenders = response.items || [];
        this.totalItems = response.totalCount || 0;
      },
      error: () => {
        this.error = 'Failed to load tenders';
      }
    });
  }
  
  initializeForm(): void {
    this.createTenderForm = this.fb.group({
        title: ['', Validators.required],
        description: [''],
        deadlineDate: ['', Validators.required]
    });
  }

  openCreateModal(): void {
      this.createTenderForm.reset();
      this.isCreateTenderModalOpen = true;
  }
  onSortChange(sortConfig: { key: keyof ReturnTenderDTO; isDescending: boolean }): void {
    this.sortColumn = sortConfig.key as string;
    this.isDescending = sortConfig.isDescending;
    this.loadTenders();
  }

  onFilterChange(filters: any): void {
    this.filterModel = {
    ...this.filterModel,
    ...filters
    };

    this.currentPage = 1;
    this.loadTenders();
  }


  publishTender(tenderId: number): void {
    this.tenderService.publishTender(tenderId).subscribe({
        next: () => {
            this.loadTenders();
            if (this.selectedTender?.id === tenderId) {
                this.viewTenderDetails({ ...this.selectedTender, status: TenderStatus.Published });
            }
        },
        error: () => this.error = 'Failed to publish tender'
    });
  }

  closeTender(tenderId: number): void {
      this.tenderService.closeTender(tenderId).subscribe({
          next: () => {
              this.loadTenders();
              if (this.selectedTender?.id === tenderId) {
                  this.viewTenderDetails({ ...this.selectedTender, status: TenderStatus.Closed });
              }
          },
          error: () => this.error = 'Failed to close tender'
      });
  }

  closeModal(): void {
      this.isCreateTenderModalOpen = false;
      this.resetCreateTenderForm();
  }

  viewTenderDetails(tender: ReturnTenderDTO): void {
    this.selectedTender = tender;
  }

  closeTenderDetails(): void {
    this.selectedTender = null;
  }

  openAddItemModal(tenderId: number): void {
      this.selectedTenderId = tenderId;
      this.resetTenderItemForm();
      this.isTenderItemModalOpen = true;
  }

  closeTenderItemModal(): void {
      this.isTenderItemModalOpen = false;
      this.resetCreateTenderForm();
  }

  resetCreateTenderForm(): void {
    this.createTenderForm.reset();
  }

  resetTenderItemForm(): void {
      this.newTenderItem = {
          tenderId: this.selectedTenderId || 0,
          medicineId: 0,
          requiredQuantity: 0
      };
  }

  
  saveTender(): void {
    if (this.createTenderForm.invalid) return;

    this.tenderService.createTender(this.createTenderForm.value).subscribe({
        next: () => {
            this.loadTenders();
            this.closeModal();
            this.error = null;
        },
        error: () => this.error = 'Failed to create tender'
    });
  }

  saveTenderItem(): void {
      if (!this.selectedTenderId) return;
      
      this.tenderService.addTenderItem(this.selectedTenderId, this.newTenderItem).subscribe({
          next: () => {
              this.loadTenders();
              this.closeTenderItemModal();
              if (this.selectedTender?.id === this.selectedTenderId) {
                  this.viewTenderDetails(this.selectedTender);
              }
              this.error = null;
          },
          error: () => this.error = 'Failed to add tender item'
      });
  }

 

  onPageChange(page: number): void {
      this.currentPage = page;
      this.loadTenders();
  }

  getTenderStatusText(status: TenderStatus): string {
    const statusMap: Record<TenderStatus, string> = {
        [TenderStatus.Created]: 'Created',
        [TenderStatus.Published]: 'Published',
        [TenderStatus.Closed]: 'Closed',
        [TenderStatus.Awarded]: 'Awarded',
        [TenderStatus.Executing]: 'Executing',
        [TenderStatus.Executed]: 'Executed',
        [TenderStatus.Cancelled]: 'Cancelled'
    };
    return statusMap[status] ?? 'Unknown';
  }

  getStatusBadgeClass(status: TenderStatus): string {
      const classMap: Record<TenderStatus, string> = {
          [TenderStatus.Created]: 'bg-secondary',
          [TenderStatus.Published]: 'bg-success',
          [TenderStatus.Closed]: 'bg-warning text-dark',
          [TenderStatus.Awarded]: 'bg-info text-dark',
          [TenderStatus.Executing]: 'bg-primary',
          [TenderStatus.Executed]: 'bg-dark',
          [TenderStatus.Cancelled]: 'bg-danger'
      };
      return classMap[status] ?? 'bg-secondary';
  }
}