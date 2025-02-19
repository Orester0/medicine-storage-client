import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';import { HttpClient } from '@angular/common/http';
import { ReturnTenderDTO, ReturnTenderProposal } from '../_models/tender.types';
import { ReturnMedicineRequestDTO } from '../_models/medicine-request.types';
import { ReturnAuditDTO } from '../_models/audit.types';
import { ReturnMedicineUsageDTO } from '../_models/medicine-usage.types';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrlAccount = `${environment.apiUrl}account`;

  
    getAuditsPlanned(): Observable<ReturnAuditDTO[]> {
      return this.http.get<ReturnAuditDTO[]>(`${this.baseUrlAccount}/audits/planned`);
    }
  
    getAuditsExecuted(): Observable<ReturnAuditDTO[]> {
      return this.http.get<ReturnAuditDTO[]>(`${this.baseUrlAccount}/audits/executed`);
    }
  
    getRequestsRequested(): Observable<ReturnMedicineRequestDTO[]> {
      return this.http.get<ReturnMedicineRequestDTO[]>(`${this.baseUrlAccount}/requests/requested`);
    }
  
    getUsagesCreated(): Observable<ReturnMedicineUsageDTO[]> {
      return this.http.get<ReturnMedicineUsageDTO[]>(`${this.baseUrlAccount}/usages/created`);
    }
  
    getRequestsApproved(): Observable<ReturnMedicineRequestDTO[]> {
      return this.http.get<ReturnMedicineRequestDTO[]>(`${this.baseUrlAccount}/requests/approved`);
    }
  
    getTendersAwarded(): Observable<ReturnTenderDTO[]> {
      return this.http.get<ReturnTenderDTO[]>(`${this.baseUrlAccount}/tenders/awarded`);
    }
  
    getProposalsCreated(): Observable<ReturnTenderProposal[]> {
      return this.http.get<ReturnTenderProposal[]>(`${this.baseUrlAccount}/proposals/created`);
    }
}
