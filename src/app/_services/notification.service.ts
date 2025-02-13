import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppNotification as AppNotification} from '../_models/notification.types';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = `${environment.apiUrl}notifications/`;
  private url = `${environment.url}`;
  private hubConnection!: signalR.HubConnection;

  private notificationReceived = new Subject<AppNotification>();
  public notification$ = this.notificationReceived.asObservable();
  

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.baseUrl}`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}mark-as-read/${notificationId}`, {});
  }

  startSignalRConnection(): Promise<void> {
    if (!this.authService.currentUser()) {
      return Promise.reject('User not authenticated');
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.url}notificationHub`, {
        withCredentials: true,
        accessTokenFactory: () => this.authService.currentUser()?.id.toString() ?? ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (notification: AppNotification) => {
      this.notificationReceived.next(notification);
    });

    return this.hubConnection.start();
  }

  stopSignalRConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
