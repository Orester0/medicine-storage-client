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
  private baseUrl = `${environment.apiUrl}usages`;

  constructor() {}

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
    if (params.medicineId) httpParams = httpParams.append('medicineId', params.medicineId.toString());
    if (params.usedByUserId) httpParams = httpParams.append('usedByUserId', params.usedByUserId.toString());
    if (params.sortBy) httpParams = httpParams.append('sortBy', params.sortBy);
    if (params.isDescending !== undefined) httpParams = httpParams.append('isDescending', params.isDescending.toString());
    if (params.pageNumber) httpParams = httpParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) httpParams = httpParams.append('pageSize', params.pageSize.toString());

    return this.http.get<PagedList<ReturnMedicineUsageDTO>>(this.baseUrl, { params: httpParams });
  }

  getUsageById(usageId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${usageId}`);
  }

  getUsagesByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/created-by/${userId}`);
  }

  createUsage(createUsageDto: CreateMedicineUsageDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, createUsageDto);
  }
}
