import { Component, inject, OnInit } from '@angular/core';
import { CreateMedicineDTO, MedicineParams, ReturnMedicineDTO } from '../../_models/medicine.types';
import { MedicineService } from '../../_services/medicine.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicinesDetailsComponent } from '../medicines-details/medicines-details.component';
import { TableAction, TableColumn, TableComponent } from '../../table/table.component';
import { DeleteConfirmationModalComponent } from '../../delete-confirmation-modal/delete-confirmation-modal.component';
import { FilterComponent, FilterConfig } from '../../filter/filter.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { CreateMedicineRequestDTO } from '../../_models/medicine-request.types';import { MedicineRequestService } from '../../_services/medicine-request.service';
import { CreateMedicineFormComponent } from '../create-medicine-form/create-medicine-form.component';
import { MedicineNotificationsComponent } from '../medicine-notifications/medicine-notifications.component';
import { CreateMedicineRequestFormComponent } from '../../medicine-request-page/create-medicine-request-form/create-medicine-request-form.component';

@Component({
  selector: 'app-medicines',
  imports: [CreateMedicineFormComponent, CreateMedicineRequestFormComponent, FilterComponent, CommonModule, PaginationComponent, MedicinesDetailsComponent, ReactiveFormsModule, TableComponent, DeleteConfirmationModalComponent, MedicineNotificationsComponent],
  templateUrl: './medicines.component.html',
  styleUrl: './medicines.component.css'
})
export class MedicinesComponent implements OnInit {
  
  filterConfig: FilterConfig[] = [
    { 
      key: 'name', 
      label: 'Name', 
      type: 'text',
      col: 3
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      col: 3,
      options: []
    },
    { 
      key: 'minStock', 
      label: 'Min Stock', 
      type: 'number',
      col: 3
    },
    { 
      key: 'maxStock', 
      label: 'Max Stock', 
      type: 'number',
      col: 3
    },
    
    { 
      key: 'requiresSpecialApproval', 
      label: 'Special Approval', 
      type: 'select',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      col: 3
    },
    
  ];
  


  filterModel: MedicineParams = {
    name: null,
    category: null,
    requiresSpecialApproval: null,
    minStock: null,
    maxStock: null,
    sortBy: 'name',
    isDescending: false,
    pageNumber: 1,
    pageSize: 10
  };
  

  tableActions: TableAction<ReturnMedicineDTO>[] = [
    {
      label: 'View Details',
      icon: 'visibility',
      class: 'btn btn-info btn-sm',
      onClick: (row) => this.viewMedicineDetails(row),
    },
    {
      label: 'Create Request',
      icon: 'add_circle',
      class: 'btn btn-primary btn-sm',
      onClick: (row) => this.openCreateRequestModal(row),
    },
    {
      label: 'Delete',
      icon: 'delete',
      class: 'btn btn-danger btn-sm',
      onClick: (row) => this.deleteMedicinePrompt(row)
    },
  ];

  isCreateRequestOpen = false;
  selectedMedicineForRequest: ReturnMedicineDTO | null = null;

  openCreateRequestModal(medicine: ReturnMedicineDTO): void {
    this.selectedMedicineForRequest = medicine;
    this.isCreateRequestOpen = true;
  }

  closeCreateRequestModal(): void {
    this.isCreateRequestOpen = false;
    this.selectedMedicineForRequest = null;
  }


  medicineColumns: TableColumn<ReturnMedicineDTO>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
    },
    { 
      key: 'actions', 
      label: 'Actions' 
    }
  ];

  medicines: ReturnMedicineDTO[] = [];
  allMedicines: ReturnMedicineDTO[] = [];
  selectedMedicine: ReturnMedicineDTO | null = null;
  error: string | null = null;

  medicineToDelete: ReturnMedicineDTO | null = null;

  sortColumn = 'name';
  isDescending = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;


  constructor(private medicineService: MedicineService, 
              private route: ActivatedRoute, 
              private medicineRequestService: MedicineRequestService 
            ) 
  {

  }

  
  
  ngOnInit(): void {
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.loadMedicines();
    this.initializeFilter();
  }
  
  loadMedicines(): void {
    const queryParams = {
      ...this.filterModel,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortColumn,
      isDescending: this.isDescending
    };
  
    this.medicineService.getMedicinesWithFilter(queryParams).subscribe({
      next: (response) => {
        this.medicines = response.items || [];
        this.totalItems = response.totalCount || 0;
      },
      error: () => {
        this.error = 'Failed to load medicines';
      }
    });
  }


  private initializeFilter(): void {
    this.filterConfig[1].options = Array.from(
      new Set(this.allMedicines.map(medicine => medicine.category))
    ).map(category => ({
      value: category,
      label: category
    }));
  }


  onSortChange(sortConfig: { key: keyof ReturnMedicineDTO; isDescending: boolean }): void {
    this.sortColumn = sortConfig.key as string;
    this.isDescending = sortConfig.isDescending;
    this.loadMedicines();
  }

  onFilterChange(filters: any): void {
    this.filterModel = {
      ...this.filterModel,
      ...filters,
    };
    this.currentPage = 1;
    this.loadMedicines();
  }


  handleRequestSubmit(request: CreateMedicineRequestDTO): void {
    this.medicineRequestService.createRequest(request).subscribe({
      next: () => {
        this.closeCreateRequestModal();
      },
      error: () => {
        this.error = 'Failed to create request';
      }
    });
  }

  isCreateMedicineOpen = false;
  saveMedicine(medicine: ReturnMedicineDTO): void {
    let request$ = this.selectedMedicine
      ? this.medicineService.updateMedicine(this.selectedMedicine.id, medicine)
      : this.medicineService.createMedicine(medicine);

    request$.subscribe({
      next: () => {
        this.isCreateMedicineOpen = false;
        this.loadMedicines();
      },

      // error: (err) => {
      //   if (err.status === 400) {
      //     this.handleServerErrors(err.error.errors);
      //   }
      // },
    });
  }

  // handleServerErrors(errors: any): void {
  //   this.serverErrors = errors;
  //   Object.keys(errors).forEach((field) => {
  //     const control = this.medicineForm.get(field.toLowerCase());
  //     if (control) {
  //       control.setErrors({ serverError: errors[field].join(' ') });
  //     }
  //   });
  // }
  
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadMedicines();
  }

  openCreateModal(): void {
    this.isCreateMedicineOpen = true;
  }

  closeModal(): void {
    this.isCreateMedicineOpen = false;
    this.selectedMedicine = null;
  }



  deleteMedicinePrompt(medicine: ReturnMedicineDTO): void {
    this.medicineToDelete = medicine;
  }

  handleDeleteConfirm(): void {
    if (!this.medicineToDelete) return;
    this.medicineService.deleteMedicine(this.medicineToDelete.id).subscribe({
      next: () => {
        this.loadMedicines();
        this.medicineToDelete = null;
      },
      error: () => {
        console.error('Failed to delete medicine.');
      },
    });
  }

  handleDeleteCancel(): void {
    this.medicineToDelete = null;
  }


  viewMedicineDetails(medicine: ReturnMedicineDTO): void {
    this.selectedMedicine = medicine;
  }

  onCloseFromDetails(): void {
    this.selectedMedicine = null;
  }

  onEditFromDetails(medicine: ReturnMedicineDTO): void {
    this.selectedMedicine = medicine;
    this.isCreateMedicineOpen = true;
  }

  onCreateRequestFromDetails(medicine: ReturnMedicineDTO): void {
    this.selectedMedicine = null;
    this.openCreateRequestModal(medicine);
  }

  onDeleteFromDetails(medicine: ReturnMedicineDTO): void {
    this.selectedMedicine = null;
    this.deleteMedicinePrompt(medicine);
  }

}