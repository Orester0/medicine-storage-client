import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedList } from '../_models/service.types';
import { MedicineUsageParams, MedicineRequestParams, ReturnMedicineRequestDTO, ReturnMedicineUsageDTO } from '.././_models/medicine-operations.types';

@Injectable({
  providedIn: 'root'
})
export class MedicineRequestService {
  private baseUrl = `${environment.apiUrl}request`;

  constructor(private http: HttpClient) {}

  getRequests(params: MedicineRequestParams): Observable<PagedList<ReturnMedicineRequestDTO>> {
    let httpParams = new HttpParams();
    
    if (params.fromDate) {
      const fromDate = params.fromDate instanceof Date ? params.fromDate.toISOString() : params.fromDate;
      httpParams = httpParams.append('fromDate', fromDate);
    }
    if (params.toDate) {
      const toDate = params.toDate instanceof Date ? params.toDate.toISOString() : params.toDate;
      httpParams = httpParams.append('toDate', toDate);
    }
    if (params.status !== null && params.status !== undefined) httpParams = httpParams.append('status', params.status.toString());
    if (params.requestedByUserId) httpParams = httpParams.append('requestedByUserId', params.requestedByUserId.toString());
    if (params.approvedByUserId) httpParams = httpParams.append('approvedByUserId', params.approvedByUserId.toString());
    if (params.medicineId) httpParams = httpParams.append('medicineId', params.medicineId.toString());
    if (params.minQuantity) httpParams = httpParams.append('minQuantity', params.minQuantity.toString());
    if (params.maxQuantity) httpParams = httpParams.append('maxQuantity', params.maxQuantity.toString());
    if (params.justification) httpParams = httpParams.append('justification', params.justification);
    if (params.sortBy) httpParams = httpParams.append('sortBy', params.sortBy);
    if (params.isDescending !== undefined) httpParams = httpParams.append('isDescending', params.isDescending.toString());
    if (params.pageNumber) httpParams = httpParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) httpParams = httpParams.append('pageSize', params.pageSize.toString());
 
    return this.http.get<PagedList<ReturnMedicineRequestDTO>>(this.baseUrl, { params: httpParams });
  }


  getRequestById(requestId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${requestId}`);
  }

  getRequestsRequestedByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/requested-by/${userId}`);
  }

  getRequestsApprovedByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/approved-by/${userId}`);
  }

  getRequestsForMedicine(medicineId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/requests-for/${medicineId}`);
  }

  getRequestByUsageId(usageId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/created-from/${usageId}`);
  }

  createRequest(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, request);
  }

  approveRequest(requestId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/approve/${requestId}`, {});
  }

  rejectRequest(requestId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/reject/${requestId}`, {});
  }

  deleteRequest(requestId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${requestId}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MedicineUsageService {
  private baseUrl = `${environment.apiUrl}usage`;

  constructor(private http: HttpClient) {}

  getUsages(params: MedicineUsageParams): Observable<PagedList<ReturnMedicineUsageDTO>> {
    let httpParams = new HttpParams();
    
    if (params.fromDate) httpParams = httpParams.append('fromDate', params.fromDate.toISOString());
    if (params.toDate) httpParams = httpParams.append('toDate', params.toDate.toISOString());
    if (params.medicineId) httpParams = httpParams.append('medicineId', params.medicineId.toString());
    if (params.usedByUserId) httpParams = httpParams.append('usedByUserId', params.usedByUserId.toString());
    if (params.medicineRequestId) httpParams = httpParams.append('medicineRequestId', params.medicineRequestId.toString());
    if (params.minQuantity) httpParams = httpParams.append('minQuantity', params.minQuantity.toString());
    if (params.maxQuantity) httpParams = httpParams.append('maxQuantity', params.maxQuantity.toString());
    if (params.notes) httpParams = httpParams.append('notes', params.notes);
    if (params.sortBy) httpParams = httpParams.append('sortBy', params.sortBy);
    if (params.isDescending !== undefined) httpParams = httpParams.append('isDescending', params.isDescending.toString());
    if (params.pageNumber) httpParams = httpParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) httpParams = httpParams.append('pageSize', params.pageSize.toString());
 
    return this.http.get<PagedList<ReturnMedicineUsageDTO>>(this.baseUrl, { params: httpParams });
  }

  getUsageById(usageId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${usageId}`);
  }

  getUsagesByRequestId(requestId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/from-request/${requestId}`);
  }

  createUsage(usage: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, usage);
  }
}