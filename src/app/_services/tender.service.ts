import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedList } from '../_models/service.types';
import { ReturnTenderDTO, CreateTenderDTO, ReturnTenderItem, CreateTenderItem, ReturnTenderProposal, CreateTenderProposal, ReturnTenderProposalItem,
    CreateTenderProposalItem,
    TenderParams
} from '../_models/tender.types';

@Injectable({
    providedIn: 'root'
  })
  export class TenderService {
    private http = inject(HttpClient);
    private baseUrlTender = `${environment.apiUrl}tender`;
  
  
    
    getAllTenders(): Observable<ReturnTenderDTO[]> {
      return this.http.get<ReturnTenderDTO[]>(`${this.baseUrlTender}/all`);
    }

    getTendersWithFilter(params: TenderParams): Observable<PagedList<ReturnTenderDTO>> {
      let httpParams = new HttpParams();
      
  
      if (params.title) httpParams = httpParams.append('title', params.title);
  
      if (params.deadlineDateFrom) {
        const toDate = params.deadlineDateFrom instanceof Date ? params.deadlineDateFrom.toISOString() : params.deadlineDateFrom;
        httpParams = httpParams.append('deadlineDateFrom', toDate);
      }
      if (params.deadlineDateTo) {
        const toDate = params.deadlineDateTo instanceof Date ? params.deadlineDateTo.toISOString() : params.deadlineDateTo;
        httpParams = httpParams.append('deadlineDateTo', toDate);
      }

      if (params.statuses && params.statuses.length > 0) {
        params.statuses.forEach(status => {
          httpParams = httpParams.append('statuses', status.toString());
        });
      }
      
      if (params.createdByUserId !== null && params.createdByUserId !== undefined) {
          httpParams = httpParams.append('createdByUserId', params.createdByUserId.toString());
      }
      if (params.openedByUserId !== null && params.openedByUserId !== undefined) {
          httpParams = httpParams.append('openedByUserId', params.openedByUserId.toString());
      }
      if (params.closedByUserId !== null && params.closedByUserId !== undefined) {
          httpParams = httpParams.append('closedByUserId', params.closedByUserId.toString());
      }
      if (params.winnerSelectedByUserId !== null && params.winnerSelectedByUserId !== undefined) {
          httpParams = httpParams.append('winnerSelectedByUserId', params.winnerSelectedByUserId.toString());
      }

      if (params.medicineIds && params.medicineIds.length > 0) {
        params.medicineIds.forEach(id => {
          httpParams = httpParams.append('medicineIds', id.toString());
        });
      }
  
      if (params.sortBy) {
          httpParams = httpParams.append('sortBy', params.sortBy);
      }
      if (params.isDescending !== null && params.isDescending !== undefined) {
          httpParams = httpParams.append('isDescending', params.isDescending.toString());
      }
  
      httpParams = httpParams.append('pageNumber', (params.pageNumber ?? 1).toString());
      httpParams = httpParams.append('pageSize', (params.pageSize ?? 10).toString());
  
      return this.http.get<PagedList<ReturnTenderDTO>>(this.baseUrlTender, { params: httpParams });
  }
  
  
    
  
    getTendersCreatedByUser(userId: number): Observable<ReturnTenderDTO[]> {
      return this.http.get<ReturnTenderDTO[]>(`${this.baseUrlTender}/created-by/${userId}`).pipe();
    }
  
    getTendersAwardedByUser(userId: number): Observable<ReturnTenderDTO[]> {
      return this.http.get<ReturnTenderDTO[]>(`${this.baseUrlTender}/awarded-by/${userId}`).pipe();
    }
  
    getTenderById(tenderId: number): Observable<ReturnTenderDTO> {
      return this.http.get<ReturnTenderDTO>(`${this.baseUrlTender}/${tenderId}`).pipe();
    }
  
  
    getProposalsByTenderId(tenderId: number): Observable<ReturnTenderProposal[]> {
      return this.http.get<ReturnTenderProposal[]>(`${this.baseUrlTender}/${tenderId}/proposals`).pipe();
    }
  
    createTender(tender: CreateTenderDTO): Observable<ReturnTenderDTO> {
      return this.http.post<ReturnTenderDTO>(`${this.baseUrlTender}/create`, tender).pipe();
    }
  
    publishTender(tenderId: number): Observable<ReturnTenderDTO> {
      return this.http.put<ReturnTenderDTO>(`${this.baseUrlTender}/publish/${tenderId}`, {}).pipe();
    }
  
    closeTender(tenderId: number): Observable<ReturnTenderDTO> {
      return this.http.put<ReturnTenderDTO>(`${this.baseUrlTender}/close/${tenderId}`, {}).pipe();
    }
  
    selectWinningProposal(tenderId: number, proposalId: number): Observable<ReturnTenderDTO> {
      return this.http.put<ReturnTenderDTO>(
        `${this.baseUrlTender}/${tenderId}/select-winning-proposal/${proposalId}`, {}).pipe();
    }
  
    

    addTenderItem(tenderId: number, tenderItem: CreateTenderItem): Observable<ReturnTenderItem> {
      return this.http.post<ReturnTenderItem>(`${this.baseUrlTender}/add-tender-item/${tenderId}`, tenderItem).pipe();
    }

    deleteTender(tenderId: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrlTender}/${tenderId}`);

    }

    // Proposal endpoints


    submitProposal(tenderId: number, proposal: CreateTenderProposal): Observable<ReturnTenderProposal> {
      return this.http.post<ReturnTenderProposal>(`${this.baseUrlTender}/proposals/submit/${tenderId}`, proposal).pipe();
    }

    executeTenderProposalItem(tenderItemId: number, proposalId: number): Observable<ReturnTenderProposal> {
      return this.http.put<ReturnTenderProposal>(`${this.baseUrlTender}/proposals/execute/${proposalId}/${tenderItemId}`, {}).pipe();
    }

    executeTenderProposal(proposalId: number): Observable<ReturnTenderProposal> {
      return this.http.put<ReturnTenderProposal>(`${this.baseUrlTender}/proposals/execute/${proposalId}`, {}).pipe();
    }
  }