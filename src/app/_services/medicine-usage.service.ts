import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedList } from '../_models/service.types';
import { CreateMedicineUsageDTO, MedicineUsageParams, ReturnMedicineUsageDTO } from '../_models/medicine-usage.types';

@Injectable({
  providedIn: 'root'
})
export class MedicineUsageService {
  private http = inject(HttpClient);
  private baseUrlMedicineUsage = `${environment.apiUrl}medicine-usage`;

  getUsages(params: MedicineUsageParams): Observable<PagedList<ReturnMedicineUsageDTO>> {
    let httpParams = new HttpParams();

    if (params.fromDate) {
      const fromDate = params.fromDate instanceof Date ? params.fromDate.toISOString() : params.fromDate;
      httpParams = httpParams.append('fromDate', fromDate);
    }
    if (params.toDate) {
      const toDate = params.toDate instanceof Date ? params.toDate.toISOString() : params.toDate;
      httpParams = httpParams.append('toDate', toDate);
    }
    if (params.medicineId){
      httpParams = httpParams.append('medicineId', params.medicineId.toString());
    } 
    if (params.usedByUserId){
      httpParams = httpParams.append('usedByUserId', params.usedByUserId.toString());
    } 
    if (params.sortBy){
      httpParams = httpParams.append('sortBy', params.sortBy);
    } 
    if (params.isDescending !== undefined){
      httpParams = httpParams.append('isDescending', params.isDescending.toString());
    } 
    

    httpParams = httpParams.append('pageNumber', (params.pageNumber ?? 1).toString());
    httpParams = httpParams.append('pageSize', (params.pageSize ?? 10).toString());

    return this.http.get<PagedList<ReturnMedicineUsageDTO>>(this.baseUrlMedicineUsage, { params: httpParams });
  }

  getUsageById(usageId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrlMedicineUsage}/${usageId}`);
  }

  getUsagesByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrlMedicineUsage}/created-by/${userId}`);
  }

  createUsage(createUsageDto: CreateMedicineUsageDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrlMedicineUsage}`, createUsageDto);
  }
}
