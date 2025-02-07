import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable, of, tap } from 'rxjs';
import { ChangePasswordDTO, ReturnUserDTO, UserToken, UserUpdateDTO } from '../_models/user.types';

@Injectable({
  providedIn: 'root'
})
export class UserService  {
  private http = inject(HttpClient);
  private baseUrlAccount = `${environment.apiUrl}account`;
  private baseUrlUser = `${environment.apiUrl}users`;

  currentUser = signal<ReturnUserDTO | null>(null);
  currentUserPhoto = signal<string | null>(null);

  
  getCurrentUserInfo(): Observable<ReturnUserDTO> {
    if (this.currentUser()) {
      return of(this.currentUser()!);
    }

    return this.http.get<ReturnUserDTO>(`${this.baseUrlAccount}/info`).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  getCurrentUserPhoto(): Observable<string> {
    if (this.currentUserPhoto()) {
      return of(this.currentUserPhoto()!);
    }

    return this.http.get(`${this.baseUrlAccount}/photo`, { responseType: 'blob' }).pipe(
      map(blob => URL.createObjectURL(blob)),
      tap(url => this.currentUserPhoto.set(url))
    );
  }

  updateCurrentUserInfo(model: UserUpdateDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrlAccount}/update`, model).pipe(
      tap(() => {
        this.currentUser.set(null);
        this.getCurrentUserInfo().subscribe();
      })
    );
  }

  changePassword(model: ChangePasswordDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrlAccount}/change-password`, model);
  }
  uploadCurrentUserPhoto(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<void>(`${this.baseUrlAccount}/upload-photo`, formData).pipe(
      tap(() => {
        if (this.currentUserPhoto()) {
          URL.revokeObjectURL(this.currentUserPhoto()!);
        }
        this.currentUserPhoto.set(null);
        this.getCurrentUserPhoto().subscribe();
      })
    );
  }
  getAllUsers(): Observable<ReturnUserDTO[]> {
    return this.http.get<ReturnUserDTO[]>(`${this.baseUrlUser}`);
  }

  private refreshUserData(): void {
    this.getCurrentUserInfo().subscribe();
    this.getCurrentUserPhoto().subscribe();
  }
  
  constructor() {
    this.refreshUserData();
  }
}

