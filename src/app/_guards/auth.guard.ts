import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const currentUser = authService.currentUserToken();
  if (!currentUser) {
    toastr.error('Authentication Required');
    router.navigate(['***']); 
    return false;
  }
  
  return true;
  
};
