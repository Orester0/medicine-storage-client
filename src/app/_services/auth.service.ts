import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserToken } from '../_models/user.types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrlAccount = `${environment.apiUrl}account`;

  
  currentUserToken = signal<UserToken | null>(null);


  constructor() { 
    const userString = localStorage.getItem('user');
    if (userString) {
      this.currentUserToken.set(JSON.parse(userString));
    }
  }

  login(model: any): Observable<UserToken> {
    return this.http.post<UserToken>(`${this.baseUrlAccount}/login`, model).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserToken.set(user);
        }
      })
    );
  }

  register(model: any): Observable<UserToken> {
    return this.http.post<UserToken>(`${this.baseUrlAccount}/register`, model).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserToken.set(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserToken.set(null);
  }
  
}
