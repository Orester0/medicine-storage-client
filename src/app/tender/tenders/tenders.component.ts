import { Component, inject, OnInit } from '@angular/core';
import { CreateTenderDTO, CreateTenderItem, ReturnTenderDTO, TenderStatus } from '../../_models/tender.types';
import { TenderService } from '../../_services/tender.service';
import { TendersDetailsComponent } from '../tenders-details/tenders-details.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicineService } from '../../_services/medicine.service';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { TableAction, TableColumn, TableComponent } from '../../table/table.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { FilterComponent, FilterConfig } from '../../filter/filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../delete-confirmation-modal/delete-confirmation-modal.component';
import { CreateTenderFormComponent } from '../create-tender-form/create-tender-form.component';
import { TenderItemsComponent } from '../tender-items/tender-items.component';
import { TenderStatusPipe } from '../../_pipes/tender-status.pipe';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.css'],
  imports: [CreateTenderFormComponent, DeleteConfirmationModalComponent, FilterComponent, FormsModule, CommonModule, TableComponent, PaginationComponent, ReactiveFormsModule],
  providers: [TenderStatusPipe, MedicineNamePipe],
})
export class TendersComponent implements OnInit {
  tenderStatusPipe = inject(TenderStatusPipe);
  medicineNamePipe = inject(MedicineNamePipe);
  
  constructor(
    private tenderService: TenderService,
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  
  ngOnInit(): void {
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.initializeFilter();
    this.loadTenders();
  }

  
  private initializeFilter(): void {
    this.filterConfig = [
      ...this.filterConfig,
      {
        key: 'medicineId',
        label: 'Medicine',
        type: 'select',
        options: this.allMedicines.map(medicine => ({
          value: medicine.id,
          label: this.medicineNamePipe.transform(medicine)
        }))
      }
    ];
  }

  // delete 
  tenderToDelete: ReturnTenderDTO | null = null;

  deleteTenderPrompt(medicine: ReturnTenderDTO): void {
    this.tenderToDelete = medicine;
  }

  handleDeleteConfirm(): void {
    if (!this.tenderToDelete) return;
    this.tenderService.deleteTender(this.tenderToDelete.id).subscribe({
      next: () => {
        this.loadTenders();
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

  // table config

  onSortChange(sortConfig: { key: keyof ReturnTenderDTO; isDescending: boolean }): void {
    this.sortColumn = sortConfig.key as string;
    this.isDescending = sortConfig.isDescending;
    this.loadTenders();
  }

  tableActions: TableAction<ReturnTenderDTO>[] = [
    {
        label: 'View Details',
        class: 'btn btn-info btn-sm',
        onClick: (row) => this.viewTenderDetails(row),
      },
      
    {
      label: 'Delete',
      class: 'btn btn-danger btn-sm me-2',
      onClick: (row) => this.deleteTenderPrompt(row),
      visible: (row) => row.status === 1,
    },
  ];

  tableColumns: TableColumn<ReturnTenderDTO>[] = [
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
      render: (value) => this.tenderStatusPipe.transform(value),
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

  // filters
  sortColumn = 'title';
  isDescending = false;

  filterModel = {
    title: '',
    status: null as TenderStatus | null,
    deadlineDateFrom: null as Date | null,
    deadlineDateTo: null as Date | null
  };

  onFilterChange(filters: any): void {
    this.filterModel = {
    ...this.filterModel,
    ...filters
    };

    this.currentPage = 1;
    this.loadTenders();
  }
  
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
            label: this.tenderStatusPipe.transform(status)
          }))
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

  // pagination

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTenders();
}


  tenders: ReturnTenderDTO[] = [];
  allMedicines: ReturnMedicineDTO[] = [];
  selectedTender: ReturnTenderDTO | null = null;
  error: string | null = null;

  isCreateTenderModalOpen = false;
  
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
  

  saveTender(tender: CreateTenderDTO): void {
    this.tenderService.createTender(tender).subscribe(() => {
      this.loadTenders();
      this.isCreateTenderModalOpen = false;
    });
  }
  

  viewTenderDetails(tender: ReturnTenderDTO): void {
    this.router.navigate(['/tenders', tender.id]);
  }

  openCreateModal(): void {
    this.isCreateTenderModalOpen = true;
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