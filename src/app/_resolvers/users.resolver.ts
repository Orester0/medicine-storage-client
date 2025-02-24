import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from '../_services/user.service';
import { ReturnUserGeneralDTO } from '../_models/user.types';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';

export const usersResolver: ResolveFn<ReturnUserGeneralDTO[]> = (route, state) => {
  const accountService = inject(UserService);
  return accountService.getAllUsers().pipe(
      catchError(error => {
        console.error('Failed to fetch users', error);
        return of([]);
      })
    );
};
