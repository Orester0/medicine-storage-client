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
      let httpParams = new HttpParams()
          .append('pageNumber', (params.pageNumber ?? 1).toString())
          .append('pageSize', (params.pageSize ?? 10).toString());
  
      if (params.title) httpParams = httpParams.append('title', params.title);
      if (params.publishDateFrom) {
          httpParams = httpParams.append(
              'publishDateFrom',
              params.publishDateFrom instanceof Date
                  ? params.publishDateFrom.toISOString()
                  : params.publishDateFrom
          );
      }
      if (params.publishDateTo) {
          httpParams = httpParams.append(
              'publishDateTo',
              params.publishDateTo instanceof Date
                  ? params.publishDateTo.toISOString()
                  : params.publishDateTo
          );
      }
      if (params.closingDateFrom) {
          httpParams = httpParams.append(
              'closingDateFrom',
              params.closingDateFrom instanceof Date
                  ? params.closingDateFrom.toISOString()
                  : params.closingDateFrom
          );
      }
      if (params.closingDateTo) {
          httpParams = httpParams.append(
              'closingDateTo',
              params.closingDateTo instanceof Date
                  ? params.closingDateTo.toISOString()
                  : params.closingDateTo
          );
      }
      if (params.deadlineDateFrom) {
          httpParams = httpParams.append(
              'deadlineDateFrom',
              params.deadlineDateFrom instanceof Date
                  ? params.deadlineDateFrom.toISOString()
                  : params.deadlineDateFrom
          );
      }
      if (params.deadlineDateTo) {
          httpParams = httpParams.append(
              'deadlineDateTo',
              params.deadlineDateTo instanceof Date
                  ? params.deadlineDateTo.toISOString()
                  : params.deadlineDateTo
          );
      }
      if (params.status !== undefined) {
          httpParams = httpParams.append('status', params.status.toString());
      }
      if (params.createdByUserId !== undefined) {
          httpParams = httpParams.append('createdByUserId', params.createdByUserId.toString());
      }
      if (params.openedByUserId !== undefined) {
          httpParams = httpParams.append('openedByUserId', params.openedByUserId.toString());
      }
      if (params.closedByUserId !== undefined) {
          httpParams = httpParams.append('closedByUserId', params.closedByUserId.toString());
      }
      if (params.winnerSelectedByUserId !== undefined) {
          httpParams = httpParams.append('winnerSelectedByUserId', params.winnerSelectedByUserId.toString());
      }
      if (params.sortBy) httpParams = httpParams.append('sortBy', params.sortBy);
      if (params.isDescending !== undefined) {
          httpParams = httpParams.append('isDescending', params.isDescending.toString());
      }
  
      return this.http.get<PagedList<ReturnTenderDTO>>(this.tenderUrl, { params: httpParams }).pipe();
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