import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ReturnUserPersonalDTO, UserParams, UserRegistrationDTO } from '../_models/user.types';
import { Observable } from 'rxjs';
import { PagedList } from '../_models/service.types';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrlAdmin = `${environment.apiUrl}admin`;

  getUsersWithFilter(params: UserParams): Observable<PagedList<ReturnUserPersonalDTO>> {
    let httpParams = new HttpParams();
    if (params.firstName) {
        httpParams = httpParams.append('firstName', params.firstName);
    }
    if (params.lastName) {
        httpParams = httpParams.append('lastName', params.lastName);
    }
    if (params.userName) {
        httpParams = httpParams.append('userName', params.userName);
    }
    if (params.email) {
        httpParams = httpParams.append('email', params.email);
    }
    if (params.position) {
        httpParams = httpParams.append('position', params.position);
    }
    if (params.company) {
        httpParams = httpParams.append('company', params.company);
    }
    if (params.roles?.length) {
        params.roles.forEach(role => {
            httpParams = httpParams.append('roles', role);
        });
    }
    if (params.sortBy) {
        httpParams = httpParams.append('sortBy', params.sortBy);
    }
    if (params.isDescending !== null && params.isDescending !== undefined) {
        httpParams = httpParams.append('isDescending', params.isDescending.toString());
    }

    httpParams = httpParams.append('pageNumber', (params.pageNumber ?? 1).toString());
    httpParams = httpParams.append('pageSize', (params.pageSize ?? 10).toString());

    return this.http.get<PagedList<ReturnUserPersonalDTO>>(`${this.baseUrlAdmin}/users`, { params: httpParams });
}
  getAllUsers(): Observable<ReturnUserPersonalDTO[]> {
    return this.http.get<ReturnUserPersonalDTO[]>(`${this.baseUrlAdmin}/users/all`);
  }
 
  getUserById(id: number): Observable<ReturnUserPersonalDTO> {
    return this.http.get<ReturnUserPersonalDTO>(`${this.baseUrlAdmin}/users/${id}`);
  }
 
  getUserRoles(userId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrlAdmin}/users/${userId}/roles`);
  }
 
  createUser(user: UserRegistrationDTO): Observable<ReturnUserPersonalDTO> {
    return this.http.post<ReturnUserPersonalDTO>(`${this.baseUrlAdmin}/users`, user);
  }
 
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlAdmin}/users/${userId}`);
  }
 
  updateRoles(userId: number, roleNames: string[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrlAdmin}/users/${userId}/roles`, roleNames);
  }
}
