import { ResolveFn } from '@angular/router';

export const medicineRequestsResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
