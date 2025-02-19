import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ReturnTenderDTO } from '../_models/tender.types';
import { TenderService } from '../_services/tender.service';

export const tendersResolver: ResolveFn<ReturnTenderDTO[]> = (route, state) => {
  const tenderService = inject(TenderService);
  return tenderService.getAllTenders().pipe(
    catchError(error => {
      console.error('Failed to fetch tenders', error);
      return of([]);
    })
  );
};
