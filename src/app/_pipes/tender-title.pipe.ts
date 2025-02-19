import { Pipe, PipeTransform } from '@angular/core';
import { ReturnMedicineDTO } from '../_models/medicine.types';
import { ReturnTenderDTO } from '../_models/tender.types';

@Pipe({
  name: 'medicineName'
})
export class TenderTitlePipe implements PipeTransform {
  transform(tender: ReturnTenderDTO | null | undefined): string {
    if (!tender || !tender.title) return 'N/A';
    return tender.title;
  }

}
