import { Component, OnInit } from '@angular/core';
import { CreateTenderDTO, CreateTenderItem, ReturnTenderDTO, TenderStatus } from '../_models/tender.types';
import { TenderService } from '../_services/tender.service';
import { TendersDetailsComponent } from '../tenders-details/tenders-details.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicineService } from '../_services/medicine.service';
import { ReturnMedicineDTO } from '../_models/medicine.types';
import { TableAction, TableColumn, TableComponent } from '../table/table.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.css'],
  imports: [TendersDetailsComponent, FormsModule, CommonModule, TableComponent, PaginationComponent]
})
export class TendersComponent implements OnInit {
    onSortChange(sortConfig: { key: keyof ReturnTenderDTO; isDescending: boolean }): void {
        this.selectedSortBy = sortConfig.key as string;
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
        label: 'Publish Tender',
        class: 'btn btn-success btn-sm me-2',
        onClick: (row) => this.publishTender(row.id),
        visible: (row) => row.status === 0,
    },
    {
        label: 'Add Item',
        class: 'btn btn-primary btn-sm me-2',
        onClick: (row) => this.openAddItemModal(row.id),
        visible: (row) => row.status === 0,
    },
    {
        label: 'Close Tender',
        class: 'btn btn-danger btn-sm me-2',
        onClick: (row) => this.closeTender(row.id),
        visible: (row) => row.status === 1,
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








  tenders: ReturnTenderDTO[] = [];
  medicines: ReturnMedicineDTO[] = [];
  selectedTender: ReturnTenderDTO | null = null;
  selectedTenderId: number | null = null;
  error: string | null = null;

  isModalOpen = false;
  isTenderItemModalOpen = false;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  selectedSortBy = 'title';
  isDescending = false;

  newTender: CreateTenderDTO = {
      title: '',
      description: '',
      deadlineDate: new Date()
  };

  newTenderItem: CreateTenderItem = {
      tenderId: 0,
      medicineId: 0,
      requiredQuantity: 0
  };

  filtersVisible: boolean = false;

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  constructor(
      private tenderService: TenderService,
      private medicineService: MedicineService
  ) {}

  ngOnInit(): void {
      this.loadTenders();
  }

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


loadTenders(): void {
    this.tenderService.getTenders({
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        sortBy: this.selectedSortBy,
        isDescending: this.isDescending,
        title: this.filterModel.title || undefined,
        publishDateFrom: this.filterModel.publishDateFrom || undefined,
        publishDateTo: this.filterModel.publishDateTo || undefined,
        status: this.filterModel.status ?? undefined,
        closingDateFrom: this.filterModel.closingDateFrom || undefined,
        closingDateTo: this.filterModel.closingDateTo || undefined,
        deadlineDateFrom: this.filterModel.deadlineDateFrom || undefined,
        deadlineDateTo: this.filterModel.deadlineDateTo || undefined
    })
    .subscribe({
        next: (response) => {
            this.tenders = response.items;
            this.totalItems = response.totalCount;
        },
        error: () => console.error('Failed to load tenders')
    });
}


applyFilters(): void {
    this.currentPage = 1;
    this.loadTenders();
}

resetFilters(): void {
    this.filterModel = {
        title: '',
        publishDateFrom: null as Date | null,
        publishDateTo: null as Date | null,
        status: null as TenderStatus | null,
        closingDateFrom: null as Date | null,
        closingDateTo: null as Date | null,
        deadlineDateFrom: null as Date | null,
        deadlineDateTo: null as Date | null
    };
    
    this.applyFilters();
}

statuses = Object.entries(TenderStatus)
    .filter(([key]) => !isNaN(Number(key)))
    .map(([key, value]) => ({
        id: Number(key),
        name: this.getTenderStatusText(Number(key))
    }));

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



  openCreateModal(): void {
      this.resetForm();
      this.isModalOpen = true;
  }

  closeModal(): void {
      this.isModalOpen = false;
      this.resetForm();
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
      this.loadMedicines();
      this.isTenderItemModalOpen = true;
  }

  closeTenderItemModal(): void {
      this.isTenderItemModalOpen = false;
      this.resetForm();
  }

  resetForm(): void {
      this.newTender = {
          title: '',
          description: '',
          deadlineDate: new Date()
      };
  }

  resetTenderItemForm(): void {
      this.newTenderItem = {
          tenderId: this.selectedTenderId || 0,
          medicineId: 0,
          requiredQuantity: 0
      };
  }

  
saveTender(): void {
    this.tenderService.createTender(this.newTender).subscribe({
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

  get totalPages(): number[] {
      const pages = Math.ceil(this.totalItems / this.pageSize);
      return Array.from({ length: pages }, (_, i) => i + 1);
  }
}