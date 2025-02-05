import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { AuditTemplateDTO, MedicineRequestTemplateDTO, NotificationTemplateBaseDTO, Template, TemplateType, TenderTemplateDTO } from '../_models/notification-template.types';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationTemplateService {
  private baseUrl = `${environment.apiUrl}templates`;

  private urlMap = {
    'medicine-request': `${this.baseUrl}/medicine-request-templates`,
    'audit': `${this.baseUrl}/audit-templates`,
    'tender': `${this.baseUrl}/tender-templates`
  };
  constructor(private http: HttpClient) { }
  
  mapToTemplateDTO(template: any): Template {
    if ('createDTO' in template) {
      if (this.isAudit(template)) {
        return Object.assign(new AuditTemplateDTO(), template);
      }
      if (this.isTender(template)) {
        return Object.assign(new TenderTemplateDTO(), template);
      }
      if (this.isMedicineRequest(template)) {
        return Object.assign(new MedicineRequestTemplateDTO(), template);
      }
    }
    throw new Error('Unknown template type');
  }
  
  isMedicineRequest(template: Template): template is MedicineRequestTemplateDTO {
    return template instanceof MedicineRequestTemplateDTO;
  }

  isAudit(template: Template): template is AuditTemplateDTO {
    return template instanceof AuditTemplateDTO;
  }

  isTender(template: Template): template is TenderTemplateDTO {
    return template instanceof TenderTemplateDTO;
  }
  
  getTemplatesByUserId<T>(type: TemplateType): Observable<T[]> {
    return this.http.get<T[]>(this.urlMap[type]);
  }

  getTemplateById<T>(type: TemplateType, id: number): Observable<T> {
    return this.http.get<T>(`${this.urlMap[type]}/${id}`);
  }
  createTemplate<T>(type: TemplateType, dto: T): Observable<T> {
    return this.http.post<T>(this.urlMap[type], dto);
  }

  updateTemplate<T>(type: TemplateType, templateId: number, dto: T): Observable<T> {
    return this.http.put<T>(`${this.urlMap[type]}/${templateId}`, dto);
  }

  executeTemplate(type: TemplateType, templateId: number, dateTime: Date): Observable<any> {
    return this.http.post(`${this.urlMap[type]}/execute/${templateId}`, dateTime);
  }
  
  activateTemplate(type: TemplateType, templateId: number): Observable<any> {
    return this.http.put(`${this.urlMap[type]}/activate/${templateId}`, {});
  }

  deactivateTemplate(type: TemplateType, templateId: number): Observable<any> {
    return this.http.put(`${this.urlMap[type]}/deactivate/${templateId}`, {});
  }

  deleteTemplate(type: TemplateType, templateId: number): Observable<any> {
    return this.http.delete(`${this.urlMap[type]}/${templateId}`);
  }

}
