import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { AuditTemplateDTO, MedicineRequestTemplateDTO, NotificationTemplateBaseDTO, Template, TemplateType, TenderTemplateDTO } from '../_models/template.types';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private http = inject(HttpClient);

  
  private baseUrlTemplates = `${environment.apiUrl}templates`;
  private urlMap = {
    'medicine-request': `${this.baseUrlTemplates}/medicine-request-templates`,
    'audit': `${this.baseUrlTemplates}/audit-templates`,
    'tender': `${this.baseUrlTemplates}/tender-templates`
  };
  
  getTemplatesByUserId<T>(type: TemplateType): Observable<T[]> {
    return this.http.get<T[]>(this.urlMap[type]);
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
