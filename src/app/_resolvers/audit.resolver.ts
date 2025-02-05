import { ResolveFn } from '@angular/router';

export const auditResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
