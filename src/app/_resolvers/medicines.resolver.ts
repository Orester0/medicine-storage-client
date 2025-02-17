import { ResolveFn } from '@angular/router';
import { ReturnMedicineDTO } from '../_models/medicine.types';
import { MedicineService } from '../_services/medicine.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { catchError, of } from 'rxjs';

export const medicinesResolver: ResolveFn<ReturnMedicineDTO[]> = (route, state) => {
  const medicineService = inject(MedicineService);
  return medicineService.getAllMedicines().pipe(
    catchError(error => {
      console.error('Failed to fetch medicines', error);
      return of([]);
    })
  );
};
