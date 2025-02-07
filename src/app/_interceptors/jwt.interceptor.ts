import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  if (accountService.currentUserToken()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accountService.currentUserToken()?.token}`
      }
    })
  }

  return next(req);
};
