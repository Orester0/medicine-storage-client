import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { ReturnTenderDTO } from '../_models/tender.types';
import { TenderService } from '../_services/tender.service';

export const tenderResolver: ResolveFn<ReturnTenderDTO> = (route, state) => {
  const tenderService = inject(TenderService);
  const tenderId = Number(route.paramMap.get('id'));

  return tenderService.getTenderById(tenderId).pipe(
    catchError(error => {
      console.error('Failed to fetch tender', error);
      return of();
    })
  );
};
