import { ResolveFn } from '@angular/router';

export const tendersResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
