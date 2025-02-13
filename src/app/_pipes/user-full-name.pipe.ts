import { Pipe, PipeTransform } from '@angular/core';
import { ReturnUserDTO } from '../_models/user.types';

@Pipe({
  name: 'userFullName'
})
export class UserFullNamePipe implements PipeTransform {
  transform(user: ReturnUserDTO | null | undefined): string {
    if (!user) return 'N/A';

    const { lastName, firstName } = user;
    return `${lastName} ${firstName}`.trim();
  }
}
