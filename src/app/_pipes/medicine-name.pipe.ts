import { Pipe, PipeTransform } from '@angular/core';
import { ReturnMedicineDTO, ReturnMedicineShortDTO } from '../_models/medicine.types';

@Pipe({
  name: 'medicineName'
})
export class MedicineNamePipe implements PipeTransform {
  transform(medicine: ReturnMedicineDTO | ReturnMedicineShortDTO | null | undefined): string {
    if (!medicine || !medicine.name) return 'N/A';
    return medicine.name;
  }

}
