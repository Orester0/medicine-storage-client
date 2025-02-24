import { Pipe, PipeTransform } from '@angular/core';
import { ReturnUserGeneralDTO, ReturnUserPersonalDTO } from '../_models/user.types';

@Pipe({
  name: 'userFullName'
})
export class UserFullNamePipe implements PipeTransform {
  transform(user: ReturnUserPersonalDTO | ReturnUserGeneralDTO | null | undefined): string {
    if (!user) return 'N/A';

    const { lastName, firstName } = user;
    return `${firstName} ${lastName}`.trim();
  }
}
