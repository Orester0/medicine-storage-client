import { Component, inject, OnInit } from '@angular/core';
import { CreateTenderDTO, ReturnTenderDTO, TenderParams, TenderStatus } from '../../_models/tender.types';
import { TenderService } from '../../_services/tender.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { TableAction, TableColumn, TableComponent } from '../../table/table.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { FilterComponent, FilterConfig } from '../../filter/filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../delete-confirmation-modal/delete-confirmation-modal.component';
import { CreateTenderFormComponent } from '../create-tender-form/create-tender-form.component';
import { TenderStatusPipe } from '../../_pipes/tender-status.pipe';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { AuthService } from '../../_services/auth.service';
import { HasRoleDirective } from '../../_directives/has-role.directive';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.css'],
  imports: [CreateTenderFormComponent, DeleteConfirmationModalComponent, FilterComponent, CommonModule, TableComponent, PaginationComponent, ReactiveFormsModule],
  providers: [TenderStatusPipe, MedicineNamePipe, HasRoleDirective],
})
export class TendersComponent implements OnInit {
  tenderStatusPipe = inject(TenderStatusPipe);
  medicineNamePipe = inject(MedicineNamePipe);

  constructor(
    private tenderService: TenderService,
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService
  ) {}

  
  ngOnInit(): void {
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.initializeFilter();
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
      key: 'medicineId',
      label: 'Medicine',
      type: 'select',
      options: []
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


  private initializeFilter(): void {
    
    this.filterConfig[2].options = this.allMedicines.map(medicine => ({
      
      value: medicine.id,
      label: this.medicineNamePipe.transform(medicine)
    }))
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

  tableActions: TableAction<ReturnTenderDTO>[] = [
    {
        label: 'View Details',
        icon: 'visibility',
        class: 'btn btn-info btn-sm',
        onClick: (row) => this.viewTenderDetails(row),
      },
      
    {
      label: 'Delete',
      icon: 'delete',
      class: 'btn btn-danger btn-sm me-2',
      onClick: (row) => this.deleteTenderPrompt(row),
      visible: (row) => {
        const userId = this.authService.currentUser()?.id; 
        const isAdmin = this.authService.userHasRole(['Admin']);
        const isCreator = row.createdByUser!.id === userId;
        return row.status === 1 && (isAdmin || isCreator);
      },
    },
  ];

  tableColumns: TableColumn<ReturnTenderDTO>[] = [
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


  

  // pagination
  


  tenders: ReturnTenderDTO[] = [];
  allMedicines: ReturnMedicineDTO[] = [];
  selectedTender: ReturnTenderDTO | null = null;
  error: string | null = null;

  isCreateTenderModalOpen = false;

  
  tenderParams: TenderParams = {
    pageNumber: 1,
    pageSize: 10,
    isDescending: false
  };

  
  totalItems = 0;
  
  private loadTenders(): void {
    this.tenderService.getTendersWithFilter(this.tenderParams).subscribe({
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

  
  onFilterChange(filters: Partial<TenderParams>): void {
    this.tenderParams = {
      ...this.tenderParams,
      ...filters,
      pageNumber: 1 
    };
    this.loadTenders();
  }

  onPageChange(page: number): void {
    this.tenderParams.pageNumber = page;
    this.loadTenders();
  }

  onSortChange(sortConfig: { key: keyof ReturnTenderDTO; isDescending: boolean }): void {
    this.tenderParams.sortBy = sortConfig.key as string;
    this.tenderParams.isDescending = sortConfig.isDescending;
    this.loadTenders();
  }
}