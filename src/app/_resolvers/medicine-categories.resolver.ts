import { ResolveFn } from '@angular/router';
import { MedicineService } from '../_services/medicine.service';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';

export const medicinecategoriesResolver: ResolveFn<String[]> = (route, state) => {
  const medicineService = inject(MedicineService);
  return medicineService.getAllCategories().pipe(
    catchError(error => {
      console.error('Failed to fetch categories', error);
      return of([]);
    })
  );
};
