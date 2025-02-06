import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedList } from '../_models/service.types';
import { ReturnAuditDTO, CreateAuditDTO, UpdateAuditItemsRequest, ReturnAuditNoteDTO, AuditParams, CreateAuditNoteDTO } from '../_models/audit.types';
@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private baseUrl = `${environment.apiUrl}audit`;

  constructor(private http: HttpClient) {}

  getAllAudits(params: AuditParams): Observable<PagedList<ReturnAuditDTO>> 
  {
    let httpParams = new HttpParams();
    if (params.fromDate) {
      const fromDate = params.fromDate instanceof Date ? params.fromDate.toISOString() : params.fromDate;
      httpParams = httpParams.append('fromDate', fromDate);
    }
    if (params.toDate) {
      const toDate = params.toDate instanceof Date ? params.toDate.toISOString() : params.toDate;
      httpParams = httpParams.append('toDate', toDate);
    }

    if (params.status !== null && params.status !== undefined) { 
      httpParams = httpParams.append('status', params.status.toString());
    }
    
    
    
    if (params.plannedByUserId !== undefined && params.plannedByUserId !== null) {
      httpParams = httpParams.append('plannedByUserId', params.plannedByUserId.toString());
    }
    if (params.executedByUserId !== undefined && params.executedByUserId !== null) {
      httpParams = httpParams.append('executedByUserId', params.executedByUserId.toString());
    }
    if (params.notes) {
      httpParams = httpParams.append('notes', params.notes);
    }
    if (params.sortBy) {
      httpParams = httpParams.append('sortBy', params.sortBy);
    }
    if (params.isDescending !== undefined) {
      httpParams = httpParams.append('isDescending', params.isDescending.toString());
    }

    httpParams = httpParams.append('pageNumber', (params.pageNumber ?? 1).toString());
    httpParams = httpParams.append('pageSize', (params.pageSize ?? 10).toString());

    return this.http.get<PagedList<ReturnAuditDTO>>(this.baseUrl, { params: httpParams });
  }

  getAuditById(auditId: number): Observable<ReturnAuditDTO> {
    return this.http.get<ReturnAuditDTO>(`${this.baseUrl}/${auditId}`);
  }

  createAudit(request: CreateAuditDTO): Observable<ReturnAuditDTO> {
    return this.http.post<ReturnAuditDTO>(`${this.baseUrl}/create`, request);
  }

  startAudit(auditId: number, notes: CreateAuditNoteDTO): Observable<ReturnAuditDTO> {
    return this.http.put<ReturnAuditDTO>(`${this.baseUrl}/start/${auditId}`, notes);
  }

  updateAuditItems(auditId: number, request: UpdateAuditItemsRequest): Observable<ReturnAuditDTO> {
    return this.http.put<ReturnAuditDTO>(`${this.baseUrl}/update-items/${auditId}`, request);
  }

  closeAudit(auditId: number, notes: CreateAuditNoteDTO): Observable<ReturnAuditDTO> {
    return this.http.put<ReturnAuditDTO>(`${this.baseUrl}/close/${auditId}`, notes);
  }

  deleteAudit(auditId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${auditId}`);
  }
}