import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  return next(req).pipe(
    catchError((error: unknown) => {
      toastr.clear();

      if (error instanceof HttpErrorResponse) {
        return handleHttpError(error, router, toastr);
      }
      return throwError(() => error);
    })
  );
};

function handleHttpError(
  error: HttpErrorResponse,
  router: Router,
  toastr: ToastrService
): Observable<never> {
  toastr.clear();



  if (error.status === 400) {
    handleValidationErrors(error, toastr);
    return throwError(() => error);
  }

  if (error.status === 401) {
    toastr.error('Your session has expired. Please login again.');
    router.navigate(['/home']);
    return throwError(() => error);
  }

  if (error.status === 403) {
    toastr.error('You are not authorized to perform this action');
    return throwError(() => error);
  }

  if (error.status === 404) {
    router.navigate(['/not-found']);
    return throwError(() => error);
  }

  if (error.status === 500) {
    router.navigate(['/internal-server-error']);
    return throwError(() => error);
  }
  return throwError(() => error);
}

function handleValidationErrors(error: HttpErrorResponse, toastr: ToastrService): void {
  if (Array.isArray(error.error?.errors)) {
    error.error.errors
      .filter((err: string) => err?.trim())
      .forEach((err: string) => toastr.error(err));
  } else if (error.error?.message) {
    toastr.error(error.error.message);
  }
}