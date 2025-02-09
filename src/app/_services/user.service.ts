import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable, of, tap } from 'rxjs';
import { ChangePasswordDTO, ReturnUserDTO, ReturnUserTokenDTO, UserUpdateDTO } from '../_models/user.types';

@Injectable({
  providedIn: 'root'
})
export class UserService  {
  private http = inject(HttpClient);
  private baseUrlUser = `${environment.apiUrl}users`;

  
  constructor() {
    
  }
  

  getAllUsers(): Observable<ReturnUserDTO[]> {
    return this.http.get<ReturnUserDTO[]>(`${this.baseUrlUser}`);
  }

}

