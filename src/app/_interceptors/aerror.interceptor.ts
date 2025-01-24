// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { catchError } from 'rxjs';

// export const errorInterceptor: HttpInterceptorFn = (req, next) => {
//   const router = inject(Router);
//   const toastr = inject(ToastrService);

//   return next(req).pipe(
//     catchError(error => {
//       if(error){
//         switch(error.status){
//           case 401:
//             toastr.error('Unauthorized', error.status);
//             break;
//           case 404:
//             router.navigateByUrl('/not-found');
//             break;
//           case 505:
//             router.navigateByUrl('/internal-server-error');
//             break;
//           default:
//             toastr.error('Something unexpected went wrong');
//             break;
//         }
//       }
//       throw error;
//     }
//     )
//   );
// };
