import { Component, inject, Input, OnInit } from '@angular/core';
import { FilterComponent, FilterConfig } from '../../filter/filter.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, RequiredValidator } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PaginationComponent } from '../../pagination/pagination.component';
import { TableColumn, TableComponent } from '../../table/table.component';
import { MedicineRequestAnalysisDto as ReturnMedicineRequestAnalysisDTO, MedicineRequestAnalysisParams, RequestStatus } from '../../_models/medicine-request.types';
import { RequestStatusPipe } from '../../_pipes/request-status.pipe';
import { MedicineRequestService } from '../../_services/medicine-request.service';
import { ToastrService } from 'ngx-toastr';
import { futureDateValidator, pastDateValidator, validDateValidator } from '../../_validators/validators';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { ReturnMedicineDTO } from '../../_models/medicine.types';

@Component({
  selector: 'app-medicine-request-analysis',
  imports: [
      FilterComponent,
      CommonModule,
      TableComponent,
      PaginationComponent,
      ReactiveFormsModule,
      MatIconModule,
      HasRoleDirective
  ],
  templateUrl: './medicine-request-analysis.component.html',
  styleUrl: './medicine-request-analysis.component.css'
})
export class MedicineRequestAnalysisComponent implements OnInit{

  @Input() medicines: ReturnMedicineDTO[] = [];

  ngOnInit(): void {
    this.initializeFilter();
  }

  private initializeFilter(): void {
    this.filterConfig[0].options = this.medicines.map(medicine => ({
      value: medicine.id,
      label: medicine.name
    }));
  }

  private toastr = inject(ToastrService);
  private requestService = inject(MedicineRequestService);
  private requestStatusPipe = inject(RequestStatusPipe);
  isRequestCountVisible = false;

  totalItems = 0;

    filterConfig: FilterConfig[] = [
      {
        key: 'medicineId',
        label: 'Medicine',
        type: 'select',
        options: []
      },
      {
        key: 'statuses',
        label: 'Status',
        type: 'select',
        multiselect: true,
        options: Object.values(RequestStatus)
              .filter(status => typeof status === 'number') 
              .map(status => ({
                value: status as RequestStatus,
                label: this.requestStatusPipe.transform(status)
              }))
      },
      {
        key: 'startDate',
        label: 'From date',
        type: 'date',
        defaultValue: new Date(2000, 0, 1),
        required: true,
        validators: [validDateValidator, futureDateValidator]
      },
      {
        key: 'endDate',
        label: 'To date',
        type: 'date',
        defaultValue: new Date(),
        required: true,
        validators: [validDateValidator]
      }
    ];
  

  requestParams: MedicineRequestAnalysisParams = {
    startDate: new Date(2000, 0, 1),
    endDate: new Date(),
    pageNumber: 1,
    pageSize: 10,
    isDescending: false,
  };
  
  requestColumns: TableColumn<ReturnMedicineRequestAnalysisDTO>[] = [
    {
      key: 'medicineName',
      label: 'Medicine',
      render: (value) => value,
      sortable: true,
    },
    {
      key: 'totalRequests',
      label: 'Total Requests',
      render: (value) => value,
      sortable: true,
    },
    {
      key: 'totalQuantity',
      label: 'Total Quantity',
      render: (value) => value,
      sortable: true,
    },
    {
      key: 'uniqueRequesters',
      label: 'Unique Requesters',
      render: (value) => value,
      sortable: true,
    },
    {
      key: 'approvedCount',
      label: 'Approved Count',
      render: (value) => value,
      sortable: true,
    },
    {
      key: 'rejectedCount',
      label: 'Rejected Count',
      render: (value) => value,
      sortable: true,
    },
    {
      key: 'pendingCount',
      label: 'Pending Count',
      render: (value) => value,
      sortable: true,
    }
  ];
  

  tableAnalisys: ReturnMedicineRequestAnalysisDTO[] = [];

  loadAnalysis(): void {
    this.requestService.getMedicineRequestAnalysis(this.requestParams).subscribe({
      next: (data) => {
        this.totalItems = data.totalCount;
        this.tableAnalisys = data.items;
      },
      error: (err) => {
        this.toastr.error('Failed to load request analysis');
        console.error(err);
      }
    });
  }
  

  toggleRequestCountSection(): void {
    this.isRequestCountVisible = !this.isRequestCountVisible;
    if (this.isRequestCountVisible) {
      this.loadAnalysis();
    }
  }

  
    onPageChange(page: number): void {
      this.requestParams.pageNumber = page;
      this.loadAnalysis();
    }
    
    onFilterChange(filters: Partial<MedicineRequestAnalysisParams>): void {
      this.requestParams = {
        ...this.requestParams,
        ...filters,
        pageNumber: 1 
      };
      this.loadAnalysis();
    }
    
    onSortChange(sortConfig: { key: keyof ReturnMedicineRequestAnalysisDTO; isDescending: boolean }): void {
      this.requestParams.sortBy = sortConfig.key as string;
      this.requestParams.isDescending = sortConfig.isDescending;
      this.loadAnalysis();
    }

}
