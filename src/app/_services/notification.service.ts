import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppNotification } from '../_models/notification.types';
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
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private notificationReceived = new Subject<AppNotification>();
  public notification$ = this.notificationReceived.asObservable();

  private isConnected = signal(false);
  private currentUser = computed(() => this.authService.currentUser());

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user && !this.isConnected()) {
        this.startSignalRConnection();
      } else if (!user && this.isConnected()) {
        this.stopSignalRConnection();
      }
    });
  }

  getUserNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.baseUrl}`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}mark-as-read/${notificationId}`, {});
  }

   async startSignalRConnection(): Promise<void> {
    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${this.url}notificationHub`, {
          withCredentials: true,
          accessTokenFactory: () => this.currentUser()?.id.toString() ?? ''
        })
        .withAutomaticReconnect()
        .build();

      this.hubConnection.on('ReceiveNotification', (notification: AppNotification) => {
        this.notificationReceived.next(notification);
      });

      await this.hubConnection.start();
      this.isConnected.set(true);
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      this.isConnected.set(false);
    }
  }

   stopSignalRConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => this.isConnected.set(false))
        .catch(error => console.error('Error stopping SignalR connection:', error));
    }
  }
}