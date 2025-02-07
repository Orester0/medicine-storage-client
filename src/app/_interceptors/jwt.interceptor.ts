import { HttpInterceptorFn } from '@angular/common/http';
import { UserService } from '../_services/user.service';
import { inject } from '@angular/core';
import { AuthService } from '../_services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (authService.currentUserToken()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.currentUserToken()?.token}`
      }
    })
  }

  return next(req);
};
