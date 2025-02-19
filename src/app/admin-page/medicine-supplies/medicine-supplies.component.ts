import { Component, inject, OnInit } from '@angular/core';
import { ReturnMedicineSupplyDTO, MedicineSupplyParams } from '../../_models/medicine-supply.types';
import { MedicineSupplyService } from '../../_services/medicine-supply.service';
import { FilterComponent, FilterConfig } from '../../filter/filter.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { TableComponent, TableColumn, TableAction } from '../../table/table.component';
import { MedicineNamePipe } from '../../_pipes/medicine-name.pipe';
import { UserFullNamePipe } from '../../_pipes/user-full-name.pipe';
import { CreateSupplyManualFormComponent } from '../create-supply-manual-modal/create-supply-manual-form.component';
import { ActivatedRoute } from '@angular/router';
import { ReturnMedicineDTO } from '../../_models/medicine.types';
import { ReturnTenderDTO } from '../../_models/tender.types';
import { ReturnUserDTO } from '../../_models/user.types';
import { CommonModule } from '@angular/common';
import { TenderTitlePipe } from '../../_pipes/tender-title.pipe';

@Component({
  selector: 'app-medicine-supplies',
  imports: [TableComponent, FilterComponent, PaginationComponent, CreateSupplyManualFormComponent, CommonModule],
  providers: [UserFullNamePipe, MedicineNamePipe, TenderTitlePipe],
  templateUrl: './medicine-supplies.component.html',
  styleUrl: './medicine-supplies.component.css'
})
export class MedicineSuppliesComponent implements OnInit{
  fullNamePipe = inject(UserFullNamePipe);
  medicineNamePipe = inject(MedicineNamePipe);
  tenderTitlePipe = inject(TenderTitlePipe);

  allMedicines: ReturnMedicineDTO[] = [];
  allUsers: ReturnUserDTO[] = [];
  allTenders: ReturnTenderDTO[] = [];
  





  supplyParams: MedicineSupplyParams = {
    pageNumber: 1,
    pageSize: 10,
    isDescending: false
  };

  totalItems = 0;

  onSupplyFilterChange(filters: Partial<MedicineSupplyParams>) {
    this.supplyParams = { 
      ...this.supplyParams, 
      ...filters, 
      pageNumber: 1 
    };
    this.loadSupplies();
  }

  onSupplySort(sort: { key: keyof ReturnMedicineSupplyDTO; isDescending: boolean }) {
    this.supplyParams.sortBy = sort.key as string;
    this.supplyParams.isDescending = sort.isDescending;
    this.loadSupplies();
  }

  onSupplyPageChange(page: number) {
    this.supplyParams.pageNumber = page;
    this.loadSupplies();
  }





  isCreateSupplyFormVisible = false;

  showCreateSupplyForm() {
    this.isCreateSupplyFormVisible = true;
  }

  hideCreateSupplyForm() {
    this.isCreateSupplyFormVisible = false;
  }

  onCreateSupply(supply: any) {
    console.log('Supply Created:', supply);
    this.medicineSupplyService.createSupply(supply).subscribe(() => {
      this.loadSupplies();
      this.hideCreateSupplyForm();
    });
  }

  onCloseCreateSupplyForm() {
    this.hideCreateSupplyForm();
  }




  
  supplies: ReturnMedicineSupplyDTO[] = [];

  constructor(private medicineSupplyService: MedicineSupplyService, private route: ActivatedRoute){}

  supplyFilters: FilterConfig[] = [
    { 
      key: 'medicineId', 
      label: 'Medicine', 
      type: 'select', 
      options: [] 
    },
    { 
      key: 'startDate', 
      label: 'Start Date', 
      type: 'date' 
    },
    { 
      key: 'endDate', 
      label: 'End Date', 
      type: 'date' 
    },
    { 
      key: 'tenderId', 
      label: 'Tender', 
      type: 'select', 
      options: [] 
    },
    { 
      key: 'createdByUserId', 
      label: 'Created By User', 
      type: 'select', 
      options: [] 
    }
  ];
  
  private initializeFilter(): void {
    this.supplyFilters[0].options = this.allMedicines.map(medicine => ({
      value: medicine.id,
      label: this.medicineNamePipe.transform(medicine) 
    }));
  
    this.supplyFilters[3].options = this.allTenders.map(tender => ({
      value: tender.id, 
      label: tender.title 
    }));
  
    this.supplyFilters[4].options = this.allUsers.map(user => ({
      value: user.id, 
      label: this.fullNamePipe.transform(user)
    }));
  }
  
  ngOnInit(): void {
    this.allMedicines = this.route.snapshot.data['medicines'];
    this.allTenders = this.route.snapshot.data['tenders'];
    this.allUsers = this.route.snapshot.data['users'];
    this.loadSupplies();
    this.initializeFilter();
  }

  
  supplyColumns: TableColumn<ReturnMedicineSupplyDTO>[] = [
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
      label: 'Quantity', 
    },
    { 
      key: 'transactionDate', 
      label: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true
    },
    { 
      key: 'createdByUser', 
      label: 'Created By', 
      render: (value) => this.fullNamePipe.transform(value),
      sortable: true
    },
    { 
      key: 'tender', 
      label: 'Tender', 
      render: (value) => this.tenderTitlePipe.transform(value),
      sortable: true
    }
    
  ];

  private loadSupplies() {
    this.medicineSupplyService.getSupplies(this.supplyParams).subscribe(
      response => {
        this.supplies = response.items;
        this.totalItems = response.totalCount;
      }
    );
  }
  
}
