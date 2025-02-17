import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ReturnUserDTO, UserRegistration } from '../_models/user.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}admin`;

  constructor() { }

  getAllUsers(): Observable<ReturnUserDTO[]> {
    return this.http.get<ReturnUserDTO[]>(`${this.baseUrl}/users`);
  }
 
  getUserById(id: number): Observable<ReturnUserDTO> {
    return this.http.get<ReturnUserDTO>(`${this.baseUrl}/users/${id}`);
  }
 
  getUserRoles(userId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/users/${userId}/roles`);
  }
 
  createUser(user: UserRegistration): Observable<ReturnUserDTO> {
    return this.http.post<ReturnUserDTO>(`${this.baseUrl}/users`, user);
  }
 
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }
 

  updateRoles(userId: number, roleNames: string[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/users/${userId}/roles`, roleNames);
  }
}
