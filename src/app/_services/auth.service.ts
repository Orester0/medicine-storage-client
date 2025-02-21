import { inject, Injectable, OnInit, signal } from '@angular/core';
import { Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChangePasswordDTO, ReturnUserDTO, UserRefreshTokenDTO, ReturnUserTokenDTO, UserUpdateDTO, ReturnUserLoginDTO, UserLoginDTO } from '../_models/user.types';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private http = inject(HttpClient);
  private baseUrlAccount = `${environment.apiUrl}account`;

  currentUserToken = signal<ReturnUserTokenDTO | null>(null);
  currentUser = signal<ReturnUserDTO | null>(null);

  
  private readonly TOKEN_KEY = 'token_Data';
  private readonly USER_DATA_KEY = 'USER_Data';

  
  constructor() {
    this.loadStoredUser();
  }

  
  private loadStoredUser(): void {
    const storedToken = localStorage.getItem(this.TOKEN_KEY);
    const storedUser = localStorage.getItem(this.USER_DATA_KEY);


    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
    if (storedToken) {
      this.currentUserToken.set(JSON.parse(storedToken));

      this.http.get<ReturnUserDTO>(`${this.baseUrlAccount}/info`).pipe(
        tap(user => {
          this.currentUser.set(user);
          this.setStorageItem(this.USER_DATA_KEY, JSON.stringify(user));
        })
      );
    }
  }

  /////////////////////////////////

  login(model: UserLoginDTO): Observable<ReturnUserLoginDTO> {
    return this.http.post<ReturnUserLoginDTO>(`${this.baseUrlAccount}/login`, model).pipe(
      tap(data => {
        this.setUserSession(data);
      })
    );
  }

  register(model: UserLoginDTO): Observable<ReturnUserLoginDTO> {
    return this.http.post<ReturnUserLoginDTO>(`${this.baseUrlAccount}/register`, model).pipe(
      tap(data => {
        this.setUserSession(data);
      })
    );
  }
  userHasRole(requiredRoles: string[]): boolean {
    const userRoles = this.currentUser()?.roles.map(role => role.toLowerCase().trim()) || [];
    return requiredRoles.some(role => userRoles.includes(role.toLowerCase().trim()));
  }
  
  
  private setUserSession(data: ReturnUserLoginDTO): void {
    if (data.returnUserTokenDTO) {
      this.currentUserToken.set(data.returnUserTokenDTO);
      this.currentUser.set(data.returnUserDTO);
      this.setStorageItem(this.TOKEN_KEY, JSON.stringify(data.returnUserTokenDTO));
      this.setStorageItem(this.USER_DATA_KEY, JSON.stringify(data.returnUserDTO));
    } 
    else 
    {
      console.error('User token is undefined');
    }
  }


  logout(): void {
    const tokens = this.currentUserToken();
    if (tokens?.refreshToken) {
      const refreshTokenDTO: UserRefreshTokenDTO = { refreshToken: tokens.refreshToken };
      this.http.post(`${this.baseUrlAccount}/revoke-token`, refreshTokenDTO, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe({
        error: err => console.warn('Failed to revoke token:', err)
      });
    } else {
      console.warn('No refresh token found.');
    }
  
    this.removeStorageItem(this.TOKEN_KEY);
    this.removeStorageItem(this.USER_DATA_KEY);
    
    this.currentUserToken.set(null);
    this.currentUser.set(null);
  }


  refreshToken(): Observable<ReturnUserTokenDTO> {
    const tokens = this.currentUserToken();
    if (!tokens?.refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    const refreshTokenDTO: UserRefreshTokenDTO = { refreshToken: tokens.refreshToken };
    return this.http.post<ReturnUserTokenDTO>(`${this.baseUrlAccount}/refresh-token`, refreshTokenDTO).pipe(
      tap(newTokens => {
        this.currentUserToken.set(newTokens);
        this.setStorageItem(this.TOKEN_KEY, JSON.stringify(newTokens));
      })
    );
  }
  

  ////////



  getCurrentUserInfo(force: boolean = false): Observable<ReturnUserDTO> {
    if (this.currentUser() && !force) {
      return of(this.currentUser()!);
    }
    return this.http.get<ReturnUserDTO>(`${this.baseUrlAccount}/info`).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.setStorageItem(this.USER_DATA_KEY, JSON.stringify(user));
      })
    );
    
  }

  updateCurrentUserInfo(model: UserUpdateDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrlAccount}/update`, model).pipe(
      tap(() => {
        this.getCurrentUserInfo(true).subscribe();
      })
    );
  }

  
  uploadCurrentUserPhoto(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<void>(`${this.baseUrlAccount}/upload-photo`, formData).pipe(
      tap(() => {
        this.getCurrentUserInfo(true).subscribe();
      })
    );
  }

  changePassword(model: ChangePasswordDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrlAccount}/change-password`, model);
  }

  
  private setStorageItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    localStorage.removeItem(key);
  }

  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

}
