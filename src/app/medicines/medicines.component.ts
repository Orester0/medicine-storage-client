import { Component, inject, OnInit } from '@angular/core';
import { CreateMedicineDTO, MedicineParams, ReturnMedicineDTO } from '../_models/medicine.types';
import { MedicineService } from '../_services/medicine.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicinesDetailsComponent } from '../medicines-details/medicines-details.component';
import { TableAction, TableColumn, TableComponent } from '../table/table.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { FilterComponent } from '../filter/filter.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-medicines',
  imports: [FormsModule, CommonModule, PaginationComponent, MedicinesDetailsComponent, ReactiveFormsModule, TableComponent, DeleteConfirmationModalComponent],
  templateUrl: './medicines.component.html',
  styleUrl: './medicines.component.css'
})
export class MedicinesComponent implements OnInit {
  get minimumStock() {
    return this.medicineForm.get('minimumStock')!;
  }
  
  get auditFrequencyDays() {
    return this.medicineForm.get('auditFrequencyDays')!;
  }

  onSortChange(sortConfig: { key: keyof ReturnMedicineDTO; isDescending: boolean }): void {
    this.sortColumn = sortConfig.key as string;
    this.isDescending = sortConfig.isDescending;
    this.loadMedicines();
  }

  tableActions: TableAction<ReturnMedicineDTO>[] = [
    {
      label: 'Delete',
      class: 'btn btn-danger btn-sm me-2',
      onClick: (row) => this.deleteMedicinePrompt(row)
    },
    {
      label: 'View Details',
      class: 'btn btn-info btn-sm',
      onClick: (row) => this.viewMedicineDetails(row),
    },
  ];

  medicineColumns: TableColumn<ReturnMedicineDTO>[] = [
    {
      key: 'id',
      label: 'ID',
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

  private readonly defaultMedicine: CreateMedicineDTO = {
    name: '',
    description: '',
    category: '',
    requiresSpecialApproval: false,
    minimumStock: 0,
    requiresStrictAudit: false,
    auditFrequencyDays: 0,
  };

  medicines: ReturnMedicineDTO[] = [];
  selectedMedicine: ReturnMedicineDTO | null = null;
  medicineForm: FormGroup;
  serverErrors: any = null;
  newMedicine: CreateMedicineDTO = { ...this.defaultMedicine };
  error: string | null = null;

  isModalOpen = false;
  medicineToDelete: ReturnMedicineDTO | null = null;

  sortColumn = 'name';
  isDescending = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(private medicineService: MedicineService, private fb: FormBuilder) {
    this.medicineForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      category: ['', [Validators.required, Validators.maxLength(100)]],
      requiresSpecialApproval: [false],
      minimumStock: [0, [Validators.required, Validators.min(0)]],
      requiresStrictAudit: [false],
      auditFrequencyDays: [1, [Validators.required, Validators.min(1), Validators.max(365)]],
    });
  }


  filtersVisible: boolean = false;

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }


  ngOnInit(): void {
    this.loadMedicines();
  }
  
  
  applyFilters(): void {
    this.currentPage = 1;
    this.loadMedicines();
  }
  
  resetFilters(): void {
    this.filterModel = {
      pageNumber: 1,
      pageSize: this.pageSize,
      sortBy: this.sortColumn,
      isDescending: this.isDescending
    };
    this.loadMedicines();
  }

  filterModel: MedicineParams = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name',
    isDescending: false
  };

  private loadMedicines(): void {
    const queryParams = {
      ...this.filterModel,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortColumn,
      isDescending: this.isDescending
    };
  
    this.medicineService.getMedicines(queryParams).subscribe({
      next: (response) => {
        this.medicines = response.items || [];
        this.totalItems = response.totalCount || 0;
      },
      error: () => {
        this.error = 'Failed to load medicines';
      }
    });
  }

  saveMedicine(): void {
    const medicineData = this.medicineForm.value;

    let request$ = this.selectedMedicine
      ? this.medicineService.updateMedicine(this.selectedMedicine.id, medicineData)
      : this.medicineService.createMedicine(medicineData);

    request$.subscribe({
      next: () => {
        this.medicineForm.reset();
        this.serverErrors = null;
      },
      error: (err) => {
        if (err.status === 400) {
          this.handleServerErrors(err.error.errors);
        }
      },
    });
  }

  handleServerErrors(errors: any): void {
    this.serverErrors = errors;
    Object.keys(errors).forEach((field) => {
      const control = this.medicineForm.get(field.toLowerCase());
      if (control) {
        control.setErrors({ serverError: errors[field].join(' ') });
      }
    });
  }

  get name() {
    return this.medicineForm.get('name')!;
  }
  get description() {
    return this.medicineForm.get('description')!;
  }
  get category() {
    return this.medicineForm.get('category')!;
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadMedicines();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
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
    this.newMedicine = { ...this.defaultMedicine };
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

  onEditFromDetails(medicine: ReturnMedicineDTO): void {
    this.newMedicine = { ...medicine };
    this.isModalOpen = true;
  }
}