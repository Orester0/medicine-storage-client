import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ChangePasswordDTO, ReturnUserDTO, UserToken, UserUpdateDTO } from '../_models/user.types';

@Injectable({
  providedIn: 'root'
})
export class AccountService  {







  
  private http = inject(HttpClient);
  private baseUrlAccount = `${environment.apiUrl}account`;
  private baseUrlUser = `${environment.apiUrl}users`;
  currentUserToken = signal<UserToken | null>(null);
  
  updateCurrentUserInfo(model: UserUpdateDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrlAccount}/update`, model);
  }

  uploadCurrentUserPhoto(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.baseUrlAccount}/upload-photo`, formData);
  }

  getCurrentUserInfo(): Observable<ReturnUserDTO> {
    return this.http.get<ReturnUserDTO>(`${this.baseUrlAccount}/info`);
  }

  changePassword(model: ChangePasswordDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrlAccount}/change-password`, model);
  }

  getCurrentUserPhoto() {
    return this.http.get(`${this.baseUrlAccount}/photo`, { responseType: 'blob' });
  }

  login(model: any){
    return this.http.post<UserToken>(this.baseUrlAccount + '/login', model).pipe(
      map(user => {
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserToken.set(user); 
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<UserToken>(this.baseUrlAccount + '/register', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserToken.set(user);
        }
        return user;
      })
    );
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserToken.set(null);
  }

  getAllUsers(): Observable<ReturnUserDTO[]> {
    return this.http.get<ReturnUserDTO[]>(`${this.baseUrlUser}`);
  }

  constructor() {
    const userString = localStorage.getItem('user');
    if (!userString) {
      return;
    }
    const user = JSON.parse(userString);
    this.currentUserToken.set(user);
   }
}
