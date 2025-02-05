import { Component, inject, OnInit } from '@angular/core';
import { CreateMedicineDTO, MedicineParams, ReturnMedicineDTO } from '../_models/medicine.types';
import { MedicineService } from '../_services/medicine.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicinesDetailsComponent } from '../medicines-details/medicines-details.component';
import { TableAction, TableColumn, TableComponent } from '../table/table.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { FilterComponent, FilterConfig } from '../filter/filter.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medicines',
  imports: [FilterComponent, FormsModule, CommonModule, PaginationComponent, MedicinesDetailsComponent, ReactiveFormsModule, TableComponent, DeleteConfirmationModalComponent],
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
      key: 'description', 
      label: 'Description', 
      type: 'text',
      col: 3
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
      key: 'minMinimumStock', 
      label: 'Min Minimum Stock', 
      type: 'number',
      col: 3
    },
    { 
      key: 'maxMinimumStock', 
      label: 'Max Minimum Stock', 
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
    { 
      key: 'requiresStrictAudit', 
      label: 'Strict Audit', 
      type: 'select',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      col: 3
    },
    { 
      key: 'minAuditFrequencyDays', 
      label: 'Min Audit Days', 
      type: 'number',
      col: 3
    },
    { 
      key: 'maxAuditFrequencyDays', 
      label: 'Max Audit Days', 
      type: 'number',
      col: 3
    }
  ];
  


  filterModel: MedicineParams = {
    name: null,
    description: null,
    category: null,
    requiresSpecialApproval: null,
    minStock: null,
    maxStock: null,
    minMinimumStock: null,
    maxMinimumStock: null,
    requiresStrictAudit: null,
    minAuditFrequencyDays: null,
    maxAuditFrequencyDays: null,
    sortBy: 'name',
    isDescending: false,
    pageNumber: 1,
    pageSize: 10
  };
  

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

  medicines: ReturnMedicineDTO[] = [];
  allMedicines: ReturnMedicineDTO[] = [];
  selectedMedicine: ReturnMedicineDTO | null = null;
  medicineForm!: FormGroup;
  serverErrors: any = null;
  error: string | null = null;

  isModalOpen = false;
  medicineToDelete: ReturnMedicineDTO | null = null;

  sortColumn = 'name';
  isDescending = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;


  constructor(private medicineService: MedicineService, private fb: FormBuilder, private route: ActivatedRoute ) {

  }

  
  
  ngOnInit(): void {
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.loadMedicines();
    this.initializeForm();
    this.initializeFilter();
  }
  
  private loadMedicines(): void {
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
    const uniqueCategories = Array.from(
      new Set(this.allMedicines.map(medicine => medicine.category))
    );
    this.filterConfig = [
      ...this.filterConfig.slice(0, 2),
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        col: 3,
        options: uniqueCategories.map(category => ({
          value: category,
          label: category
        }))
      },
      ...this.filterConfig.slice(2), 
    ];
    
  }
  

  private initializeForm(): void {
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
  
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadMedicines();
  }

  openCreateModal(): void {
    this.resetCreateMedicineForm();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetCreateMedicineForm();
  }

  resetCreateMedicineForm(): void {
    this.medicineForm.reset({
      name: '',
      description: '',
      category: '',
      requiresSpecialApproval: false,
      minimumStock: 0,
      requiresStrictAudit: false,
      auditFrequencyDays: 1
    });
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
    this.medicineForm.patchValue(medicine);
    this.isModalOpen = true;
  }

  

  
  get minimumStock() {
    return this.medicineForm.get('minimumStock')!;
  }
  
  get auditFrequencyDays() {
    return this.medicineForm.get('auditFrequencyDays')!;
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

}