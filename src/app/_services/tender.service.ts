import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    private tenderUrl = `${environment.apiUrl}tender`;
    private proposalUrl = `${environment.apiUrl}tenderproposal`;
  
    constructor(private http: HttpClient) {}
  
    // Tender endpoints
    getTenders(params: TenderParams): Observable<PagedList<ReturnTenderDTO>> {
      let httpParams = new HttpParams();
  
      if (params.title) httpParams = httpParams.append('title', params.title);
  
      if (params.publishDateFrom) {
        const fromDate = params.publishDateFrom instanceof Date ? params.publishDateFrom.toISOString() : params.publishDateFrom;
        httpParams = httpParams.append('publishDateFrom', fromDate);
      }
      if (params.publishDateTo) {
        const toDate = params.publishDateTo instanceof Date ? params.publishDateTo.toISOString() : params.publishDateTo;
        httpParams = httpParams.append('publishDateTo', toDate);
      }
      if (params.closingDateFrom) {
        const toDate = params.closingDateFrom instanceof Date ? params.closingDateFrom.toISOString() : params.closingDateFrom;
        httpParams = httpParams.append('closingDateFrom', toDate);
      }
      if (params.closingDateTo) {
        const toDate = params.closingDateTo instanceof Date ? params.closingDateTo.toISOString() : params.closingDateTo;
        httpParams = httpParams.append('closingDateTo', toDate);
      }
      if (params.deadlineDateFrom) {
        const toDate = params.deadlineDateFrom instanceof Date ? params.deadlineDateFrom.toISOString() : params.deadlineDateFrom;
        httpParams = httpParams.append('deadlineDateFrom', toDate);
      }
      if (params.deadlineDateTo) {
        const toDate = params.deadlineDateTo instanceof Date ? params.deadlineDateTo.toISOString() : params.deadlineDateTo;
        httpParams = httpParams.append('deadlineDateTo', toDate);
      }
      if (params.status !== null && params.status !== undefined) {
          httpParams = httpParams.append('status', params.status.toString());
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
  
      if (params.sortBy) {
          httpParams = httpParams.append('sortBy', params.sortBy);
      }
      if (params.isDescending !== null && params.isDescending !== undefined) {
          httpParams = httpParams.append('isDescending', params.isDescending.toString());
      }
  
      httpParams = httpParams.append('pageNumber', (params.pageNumber ?? 1).toString());
      httpParams = httpParams.append('pageSize', (params.pageSize ?? 10).toString());
  
      return this.http.get<PagedList<ReturnTenderDTO>>(this.tenderUrl, { params: httpParams });
  }
  
  
    
  
    getTendersCreatedByUser(userId: number): Observable<ReturnTenderDTO[]> {
      return this.http.get<ReturnTenderDTO[]>(`${this.tenderUrl}/created-by/${userId}`).pipe();
    }
  
    getTendersAwardedByUser(userId: number): Observable<ReturnTenderDTO[]> {
      return this.http.get<ReturnTenderDTO[]>(`${this.tenderUrl}/awarded-by/${userId}`).pipe();
    }
  
    getTenderById(tenderId: number): Observable<ReturnTenderDTO> {
      return this.http.get<ReturnTenderDTO>(`${this.tenderUrl}/${tenderId}`).pipe();
    }
  
    getTenderItems(tenderId: number): Observable<ReturnTenderItem[]> {
      return this.http.get<ReturnTenderItem[]>(`${this.tenderUrl}/${tenderId}/tender-items`).pipe();
    }
  
    getProposalsByTenderId(tenderId: number): Observable<ReturnTenderProposal[]> {
      return this.http.get<ReturnTenderProposal[]>(`${this.tenderUrl}/${tenderId}/proposals`).pipe();
    }
  
    createTender(tender: CreateTenderDTO): Observable<ReturnTenderDTO> {
      return this.http.post<ReturnTenderDTO>(`${this.tenderUrl}/create`, tender).pipe();
    }
  
    publishTender(tenderId: number): Observable<ReturnTenderDTO> {
      return this.http.put<ReturnTenderDTO>(`${this.tenderUrl}/publish/${tenderId}`, {}).pipe();
    }
  
    closeTender(tenderId: number): Observable<ReturnTenderDTO> {
      return this.http.put<ReturnTenderDTO>(`${this.tenderUrl}/close/${tenderId}`, {}).pipe();
    }
  
    selectWinningProposal(tenderId: number, proposalId: number): Observable<ReturnTenderDTO> {
      return this.http.put<ReturnTenderDTO>(
        `${this.tenderUrl}/${tenderId}/select-winning-proposal/${proposalId}`, {}).pipe();
    }
  
    // Proposal endpoints
    getProposalById(proposalId: number): Observable<ReturnTenderProposal> {
      return this.http.get<ReturnTenderProposal>(`${this.proposalUrl}/${proposalId}`).pipe();
    }
  
    getProposalItems(proposalId: number): Observable<ReturnTenderProposalItem[]> {
      return this.http.get<ReturnTenderProposalItem[]>(`${this.proposalUrl}/${proposalId}/proposal-items`).pipe();
    }
  
    submitProposal(tenderId: number, proposal: CreateTenderProposal): Observable<ReturnTenderProposal> {
      return this.http.post<ReturnTenderProposal>(`${this.proposalUrl}/submit/${tenderId}`, proposal).pipe();
    }
  
    executeTenderItem(tenderItemId: number, proposalId: number): Observable<ReturnTenderProposal> {
      return this.http.put<ReturnTenderProposal>(
        `${this.proposalUrl}/execute/${proposalId}/${tenderItemId}`, {}).pipe();
    }
  
    executeTender(proposalId: number): Observable<ReturnTenderProposal> {
      return this.http.put<ReturnTenderProposal>(`${this.proposalUrl}/execute/${proposalId}`, {}).pipe();
    }

    addTenderItem(tenderId: number, tenderItem: CreateTenderItem): Observable<ReturnTenderItem> {
      return this.http.post<ReturnTenderItem>(`${this.tenderUrl}/add-tender-item/${tenderId}`, tenderItem).pipe();
  }
  }