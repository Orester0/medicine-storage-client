import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedList } from '../_models/service.types';
import { CreateMedicineSupplyDTO, MedicineSupplyParams, ReturnMedicineSupplyDTO } from '../_models/medicine-supply.types';

@Injectable({
  providedIn: 'root'
})
export class MedicineSupplyService {
  private http = inject(HttpClient);
  private baseUrlMedicineSupply = `${environment.apiUrl}medicine-supply`;

  getSupplies(params: MedicineSupplyParams): Observable<PagedList<ReturnMedicineSupplyDTO>> {
    let httpParams = new HttpParams();

    if (params.medicineId){
      httpParams = httpParams.append('medicineId', params.medicineId.toString());
    } 
    if (params.tenderId){
      httpParams = httpParams.append('tenderId', params.tenderId.toString());
    }
    if (params.createdByUserId){
      httpParams = httpParams.append('createdByUserId', params.createdByUserId.toString());
    }
    if (params.startDate) {
      const startDate = params.startDate instanceof Date ? params.startDate.toISOString() : params.startDate;
      httpParams = httpParams.append('startDate', startDate);
    }
    if (params.endDate) {
      const endDate = params.endDate instanceof Date ? params.endDate.toISOString() : params.endDate;
      httpParams = httpParams.append('endDate', endDate);
    }
    if (params.sortBy){
      httpParams = httpParams.append('sortBy', params.sortBy);
    } 
    if (params.isDescending !== undefined){
      httpParams = httpParams.append('isDescending', params.isDescending.toString());
    } 
    
    httpParams = httpParams.append('pageNumber', (params.pageNumber ?? 1).toString());
    httpParams = httpParams.append('pageSize', (params.pageSize ?? 10).toString());

    return this.http.get<PagedList<ReturnMedicineSupplyDTO>>(this.baseUrlMedicineSupply, { params: httpParams });
  }

  createSupply(createSupplyDto: CreateMedicineSupplyDTO): Observable<ReturnMedicineSupplyDTO> {
    return this.http.post<ReturnMedicineSupplyDTO>(this.baseUrlMedicineSupply, createSupplyDto);
  }
}
