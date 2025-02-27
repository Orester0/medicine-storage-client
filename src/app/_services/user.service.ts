import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ReturnUserGeneralDTO } from '../_models/user.types';

@Injectable({
  providedIn: 'root'
})
export class UserService  {
  private http = inject(HttpClient);
  private baseUrlUser = `${environment.apiUrl}users`;

  getAllUsers(): Observable<ReturnUserGeneralDTO[]> {
    return this.http.get<ReturnUserGeneralDTO[]>(`${this.baseUrlUser}/all`);
  }

}

