import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { UserDTO, UserToken } from '../_models/user.types';

@Injectable({
  providedIn: 'root'
})
export class AccountService  {
  private http = inject(HttpClient);
  private baseUrlAccount = `${environment.apiUrl}account`;
  private baseUrlUser = `${environment.apiUrl}users`;
  currentUser = signal<UserToken | null>(null);

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrlAccount}/upload-photo`, formData);
  }

  getPhoto() {
    return this.http.get(`${this.baseUrlAccount}/photo`, { responseType: 'blob' });
  }

  login(model: any){
    return this.http.post<UserToken>(this.baseUrlAccount + '/login', model).pipe(
      map(user => {
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user); 
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<UserToken>(this.baseUrlAccount + '/register', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      })
    );
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.baseUrlUser}`);
  }

  constructor() {
    const userString = localStorage.getItem('user');
    if (!userString) {
      return;
    }
    const user = JSON.parse(userString);
    this.currentUser.set(user);
   }
}
