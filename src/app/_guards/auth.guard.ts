import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  // const accountService = inject(AccountService);
  // const toastr = inject(ToastrService);
  // const router = inject(Router);

  // const currentUser = accountService.currentUser();
  // toastr.clear();
  // // if (!currentUser) {
    
  // //   toastr.error('Need to log in', 'Authentication Required');
  // //   router.navigate(['***']); 
  // //   return false;
  // // }
  
  return true;
  
};
