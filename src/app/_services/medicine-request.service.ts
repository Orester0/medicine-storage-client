import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedList } from '../_models/service.types';
import { MedicineRequestParams, ReturnMedicineRequestDTO } from '../_models/medicine-request.types';

@Injectable({
  providedIn: 'root'
})
export class MedicineRequestService {
  private http = inject(HttpClient);
  private baseUrlMedicineRequest = `${environment.apiUrl}medicine-request`;


  getRequestsWithFilters(params: MedicineRequestParams): Observable<PagedList<ReturnMedicineRequestDTO>> {
    let httpParams = new HttpParams();
    
    if (params.fromDate) {
      const fromDate = params.fromDate instanceof Date ? params.fromDate.toISOString() : params.fromDate;
      httpParams = httpParams.append('fromDate', fromDate);
    }
    if (params.toDate) {
      const toDate = params.toDate instanceof Date ? params.toDate.toISOString() : params.toDate;
      httpParams = httpParams.append('toDate', toDate);
    }

    
    if (params.statuses && params.statuses.length > 0) {
      params.statuses.forEach(status => {
        httpParams = httpParams.append('statuses', status.toString());
      });
    }
    
    if (params.requestedByUserId){
      httpParams = httpParams.append('requestedByUserId', params.requestedByUserId.toString());
    } 
    if (params.approvedByUserId){
      httpParams = httpParams.append('approvedByUserId', params.approvedByUserId.toString());
    }
    if (params.medicineId){
      httpParams = httpParams.append('medicineId', params.medicineId.toString());
    }
    if (params.minQuantity){
      httpParams = httpParams.append('minQuantity', params.minQuantity.toString());
    } 
    if (params.maxQuantity){
      httpParams = httpParams.append('maxQuantity', params.maxQuantity.toString());
    } 
    if (params.justification){
      httpParams = httpParams.append('justification', params.justification);
    } 
    if (params.sortBy){
      httpParams = httpParams.append('sortBy', params.sortBy);
    } 
    if (params.isDescending !== undefined){
      httpParams = httpParams.append('isDescending', params.isDescending.toString());
    } 
    
    httpParams = httpParams.append('pageNumber', (params.pageNumber ?? 1).toString());
    httpParams = httpParams.append('pageSize', (params.pageSize ?? 10).toString());
 
    return this.http.get<PagedList<ReturnMedicineRequestDTO>>(this.baseUrlMedicineRequest, { params: httpParams });
  }


  getRequestById(requestId: number): Observable<ReturnMedicineRequestDTO> {
    return this.http.get<any>(`${this.baseUrlMedicineRequest}/${requestId}`);
  }

  getRequestsRequestedByUser(userId: number): Observable<ReturnMedicineRequestDTO[]> {
    return this.http.get<any>(`${this.baseUrlMedicineRequest}/requested-by/${userId}`);
  }

  getRequestsApprovedByUser(userId: number): Observable<ReturnMedicineRequestDTO[]> {
    return this.http.get<any>(`${this.baseUrlMedicineRequest}/approved-by/${userId}`);
  }

  getRequestsForMedicine(medicineId: number): Observable<ReturnMedicineRequestDTO[]> {
    return this.http.get<any>(`${this.baseUrlMedicineRequest}/requests-for/${medicineId}`);
  }

  getRequestByUsageId(usageId: number): Observable<ReturnMedicineRequestDTO> {
    return this.http.get<any>(`${this.baseUrlMedicineRequest}/created-from/${usageId}`);
  }

  createRequest(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrlMedicineRequest}/create`, request);
  }

  approveRequest(requestId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrlMedicineRequest}/approve/${requestId}`, {});
  }

  rejectRequest(requestId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrlMedicineRequest}/reject/${requestId}`, {});
  }

  deleteRequest(requestId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlMedicineRequest}/${requestId}`);
  }
}