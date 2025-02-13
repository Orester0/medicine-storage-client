import { Pipe, PipeTransform } from '@angular/core';
import { ReturnMedicineDTO } from '../_models/medicine.types';

@Pipe({
  name: 'medicineName'
})
export class MedicineNamePipe implements PipeTransform {
  transform(medicine: ReturnMedicineDTO | null | undefined): string {
    if (!medicine || !medicine.name) return 'N/A';
    return medicine.name;
  }

}
