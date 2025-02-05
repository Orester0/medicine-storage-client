import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      toastr.clear();
      if (Array.isArray(error.error.errors) && error.error.errors.length > 0) {
        
        error.error.errors
          .filter((err: string) => err.trim() !== '')
          .forEach((err: string) => toastr.error(err));
      } 
      
      else if (error.error?.statusCode) {
        const { statusCode, message } = error.error;

        if (message) 
          {
          toastr.error(message);
          return throwError(() => error);
        } 
        // else 
        // {
        //   toastr.error('An unexpected error occurred');
        //   return throwError(() => error);
        // }

        switch (statusCode) {
          case 404:
            router.navigate(['/not-found']);
            break;
          case 500:
            router.navigate(['/internal-server-error']);
            break;
          case 0:
            toastr.error('No connection to the server. Please check your internet connection.');
            break;
          default:
            toastr.error('An unexpected error occurred');
            break;
        }
      } 

      return throwError(() => error);
    })
  );
};
