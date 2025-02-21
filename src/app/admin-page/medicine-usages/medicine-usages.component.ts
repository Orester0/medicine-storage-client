import { Component, inject, OnInit } from '@angular/core';
import { ReturnMedicineUsageDTO, MedicineUsageParams } from '../../_models/medicine-usage.types';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { UserFullNamePipe } from '../../_pipes/user-full-name.pipe';
import { MedicineUsageService } from '../../_services/medicine-usage.service';
import { FilterComponent, FilterConfig } from '../../filter/filter.component';
import { TableColumn, TableComponent } from '../../table/table.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { ReturnUserDTO } from '../../_models/user.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medicine-usages',
  imports: [FilterComponent, TableComponent, PaginationComponent, CommonModule],
  providers: [UserFullNamePipe, MedicineNamePipe],
  templateUrl: './medicine-usages.component.html',
  styleUrl: './medicine-usages.component.css'
})
export class MedicineUsagesComponent implements OnInit{
  fullNamePipe = inject(UserFullNamePipe);
  medicineNamePipe = inject(MedicineNamePipe);

  allMedicines: ReturnMedicineDTO[] = [];
  allUsers: ReturnUserDTO[] = [];

  totalUsages = 0;

  usageParams: MedicineUsageParams = {
    pageNumber: 1,
    pageSize: 10,
    isDescending: false
  };

  totalItems: TableColumn<ReturnMedicineUsageDTO>[] = [
    { 
      key: 'id', 
      label: 'ID',
      sortable: true
    },
    { 
      key: 'medicine', 
      label: 'Medicine', 
      render: (value) => this.medicineNamePipe.transform(value), 
      sortable: true
    },
    { 
      key: 'quantity', 
      label: 'Quantity' 
    },
    { 
      key: 'usageDate', 
      label: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true
    },
    { 
      key: 'usedByUser', 
      label: 'Used By', 
      render: (value) => this.fullNamePipe.transform(value),
      sortable: true
    }
  ];


  usageFilters: FilterConfig[] = [
    { 
      key: 'medicineId', 
      label: 'Medicine', 
      type: 'select', 
      options: [] 
    },
    { 
      key: 'fromDate', 
      label: 'From Date', 
      type: 'date' 
    },
    { 
      key: 'toDate', 
      label: 'To Date', 
      type: 'date' 
    },
    { 
      key: 'usedByUserId', 
      label: 'Used By User', 
      type: 'select', 
      options: [] 
    }
  ];



  usages: ReturnMedicineUsageDTO[] = [];

  constructor(private medicineUsageService: MedicineUsageService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.allUsers = this.route.snapshot.data['users'];
    this.loadUsages();
    this.initializeFilter();
  }

  private initializeFilter(): void {
    this.usageFilters[0].options = this.allMedicines.map(medicine => ({
      value: medicine.id,
      label: this.medicineNamePipe.transform(medicine) 
    }));

    this.usageFilters[3].options = this.allUsers.map(user => ({
      value: user.id, 
      label: this.fullNamePipe.transform(user)
    }));
  }
  
  private loadUsages() {
    this.medicineUsageService.getUsages(this.usageParams).subscribe(
      response => {
        this.usages = response.items;
        this.totalUsages = response.totalCount;
      }
    );
  }

  onFilterChange(filters: Partial<MedicineUsageParams>) {
    this.usageParams = { 
      ...this.usageParams, 
      ...filters, 
      pageNumber: 1 
    };
    this.loadUsages();
  }

  onSortChange(sort: { key: keyof ReturnMedicineUsageDTO; isDescending: boolean }) {
    this.usageParams.sortBy = sort.key as string;
    this.usageParams.isDescending = sort.isDescending;
    this.loadUsages();
  }

  onPageChange(page: number) {
    this.usageParams.pageNumber = page;
    this.loadUsages();
  }



}
