import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedList } from '../_models/service.types';
import { ReturnAuditDTO, CreateAuditDTO, UpdateAuditItemsRequest, ReturnAuditNoteDTO, AuditParams, CreateAuditNoteDTO } from '../_models/audit.types';
@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private http = inject(HttpClient);
  private baseUrlAudit = `${environment.apiUrl}audit`;

  getAuditsWithFilters(params: AuditParams): Observable<PagedList<ReturnAuditDTO>> {
    let httpParams = new HttpParams();
  
    if (params.title) {
      httpParams = httpParams.append('title', params.title);
    }
    if (params.fromPlannedDate) {
      const fromPlannedDate = params.fromPlannedDate instanceof Date ? params.fromPlannedDate.toISOString() : params.fromPlannedDate;
      httpParams = httpParams.append('fromPlannedDate', fromPlannedDate);
    }
    if (params.toPlannedDate) {
      const toPlannedDate = params.toPlannedDate instanceof Date ? params.toPlannedDate.toISOString() : params.toPlannedDate;
      httpParams = httpParams.append('toPlannedDate', toPlannedDate);
    }
    if (params.statuses && params.statuses.length > 0) {
      params.statuses.forEach(status => {
        httpParams = httpParams.append('statuses', status.toString());
      });
    }
    
    if (params.plannedByUserId !== null && params.plannedByUserId !== undefined) {
      httpParams = httpParams.append('plannedByUserId', params.plannedByUserId.toString());
    }
    if (params.closedByUserId !== null && params.closedByUserId !== undefined) {
      httpParams = httpParams.append('closedByUserId', params.closedByUserId.toString());
    }
    if (params.executedByUserId !== null && params.executedByUserId !== undefined) {
      httpParams = httpParams.append('executedByUserId', params.executedByUserId.toString());
    }
    if (params.sortBy) {
      httpParams = httpParams.append('sortBy', params.sortBy);
    }
    if (params.isDescending !== undefined) {
      httpParams = httpParams.append('isDescending', params.isDescending.toString());
    }
  
    httpParams = httpParams.append('pageNumber', (params.pageNumber ?? 1).toString());
    httpParams = httpParams.append('pageSize', (params.pageSize ?? 10).toString());
  
    return this.http.get<PagedList<ReturnAuditDTO>>(this.baseUrlAudit, { params: httpParams });
  }
  

  getAuditById(auditId: number): Observable<ReturnAuditDTO> {
    return this.http.get<ReturnAuditDTO>(`${this.baseUrlAudit}/${auditId}`);
  }

  createAudit(request: CreateAuditDTO): Observable<ReturnAuditDTO> {
    return this.http.post<ReturnAuditDTO>(`${this.baseUrlAudit}/create`, request);
  }

  startAudit(auditId: number, notes: CreateAuditNoteDTO): Observable<ReturnAuditDTO> {
    return this.http.put<ReturnAuditDTO>(`${this.baseUrlAudit}/start/${auditId}`, notes);
  }

  updateAuditItems(auditId: number, request: UpdateAuditItemsRequest): Observable<ReturnAuditDTO> {
    return this.http.put<ReturnAuditDTO>(`${this.baseUrlAudit}/update-items/${auditId}`, request);
  }

  closeAudit(auditId: number, notes: CreateAuditNoteDTO): Observable<ReturnAuditDTO> {
    return this.http.put<ReturnAuditDTO>(`${this.baseUrlAudit}/close/${auditId}`, notes);
  }

  deleteAudit(auditId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlAudit}/${auditId}`);
  }
}