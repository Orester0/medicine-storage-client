import { Component, inject, OnInit } from '@angular/core';
import { MedicineParams, ReturnMedicineDTO } from '../../_models/medicine.types';
import { MedicineService } from '../../_services/medicine.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicinesDetailsComponent } from '../medicines-details/medicines-details.component';
import { TableAction, TableColumn, TableComponent } from '../../table/table.component';
import { DeleteConfirmationModalComponent } from '../../delete-confirmation-modal/delete-confirmation-modal.component';
import { FilterComponent, FilterConfig } from '../../filter/filter.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { CreateMedicineRequestDTO } from '../../_models/medicine-request.types';
import { MedicineRequestService } from '../../_services/medicine-request.service';
import { CreateMedicineFormComponent } from '../create-medicine-form/create-medicine-form.component';
import { MedicineNotificationsComponent } from '../medicine-notifications/medicine-notifications.component';
import { CreateMedicineRequestFormComponent } from '../../medicine-request-page/create-medicine-request-form/create-medicine-request-form.component';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HasRoleDirective } from '../../_directives/has-role.directive';

@Component({
  selector: 'app-medicines',
  imports: [
    CreateMedicineFormComponent, 
    CreateMedicineRequestFormComponent, 
    FilterComponent, 
    CommonModule, 
    PaginationComponent, 
    MedicinesDetailsComponent, 
    ReactiveFormsModule, 
    TableComponent, 
    DeleteConfirmationModalComponent, 
    MedicineNotificationsComponent,
    HasRoleDirective
  ],
  templateUrl: './medicines.component.html',
  styleUrl: './medicines.component.css'
})
export class MedicinesComponent implements OnInit {
  private medicineService = inject(MedicineService);
  private medicineRequestService = inject(MedicineRequestService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  medicines: ReturnMedicineDTO[] = [];
  allMedicines: ReturnMedicineDTO[] = [];
  totalItems = 0;
  
  selectedMedicine: ReturnMedicineDTO | null = null;
  medicineToDelete: ReturnMedicineDTO | null = null;
  isCreateMedicineOpen = false;
  isCreateRequestOpen = false;
  selectedMedicineForRequest: ReturnMedicineDTO | null = null;

  medicineParams: MedicineParams = {
    isDescending: false,
    pageNumber: 1,
    pageSize: 10
  };

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
      onClick: (row) => this.deleteMedicinePrompt(row),
      visible: () => {
        const isAdmin = this.authService.userHasRole(['Admin']);
        return isAdmin;
      },
    },
  ];

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
      multiselect: true,
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

  ngOnInit(): void {
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.initializeFilter();
    // this.loadMedicines();
  }

  private initializeFilter(): void {
    this.filterConfig[1].options = Array.from(
      new Set(this.allMedicines.map(medicine => medicine.category))
    ).map(category => ({
      value: category,
      label: category
    }));
  }

  loadMedicines(): void {
    this.medicineService.getMedicinesWithFilter(this.medicineParams).subscribe({
      next: (response) => {
        this.medicines = response.items;
        this.totalItems = response.totalCount;
        this.selectedMedicine = null;
      }
    });
  }

  createMedicine(medicine: ReturnMedicineDTO): void {
    this.medicineService.createMedicine(medicine).subscribe({
      next: () => {
        this.toastr.success('Medicine created successfully');
        this.isCreateMedicineOpen = false;
        this.loadMedicines();
      }
    });
  }
  
  updateMedicine(medicine: ReturnMedicineDTO): void {
    if (!this.selectedMedicine) return; 
  
    this.medicineService.updateMedicine(this.selectedMedicine.id, medicine).subscribe({
      next: () => {
        this.toastr.success('Medicine has been updated');
        this.isCreateMedicineOpen = false;
        this.loadMedicines();
      }
    });
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
        this.toastr.success('Medicine has been deleted');
      }
    });
  }

  handleDeleteCancel(): void {
    this.medicineToDelete = null;
  }

  openCreateRequestModal(medicine: ReturnMedicineDTO): void {
    this.selectedMedicineForRequest = medicine;
    this.isCreateRequestOpen = true;
  }

  closeCreateRequestModal(): void {
    this.isCreateRequestOpen = false;
    this.selectedMedicineForRequest = null;
  }

  handleRequestSubmit(request: CreateMedicineRequestDTO): void {
    this.medicineRequestService.createRequest(request).subscribe({
      next: () => {
        this.toastr.success('Request created successfully');
        this.closeCreateRequestModal();
      }
    });
  }

  openCreateModal(): void {
    this.isCreateMedicineOpen = true;
  }

  closeModal(): void {
    this.isCreateMedicineOpen = false;
    this.selectedMedicine = null;
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

  onSortChange(sortConfig: { key: keyof ReturnMedicineDTO; isDescending: boolean }): void {
    this.medicineParams.sortBy = sortConfig.key as string;
    this.medicineParams.isDescending = sortConfig.isDescending;
    this.loadMedicines();
  }

  onFilterChange(filters: Partial<MedicineParams>): void {
    this.medicineParams = {
      ...this.medicineParams, 
      ...filters, 
      pageNumber: 1 
    };
    this.loadMedicines();
  }

  onPageChange(page: number): void {
    this.medicineParams.pageNumber = page;
    this.loadMedicines();
  }
}