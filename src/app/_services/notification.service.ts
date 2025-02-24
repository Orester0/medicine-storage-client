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
  private http = inject(HttpClient);
  private authService = inject(AuthService);


  private baseUrlNotifications = `${environment.apiUrl}notifications`;
  private webSocketUrl = `${environment.url}notificationHub`;
  private hubConnection: signalR.HubConnection | null = null;

  private notificationReceived = new Subject<AppNotification>();
  public notification$ = this.notificationReceived.asObservable();

  private isConnected = signal(false);
  private currentUser = computed(() => this.authService.currentUser());

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user && !this.isConnected()) {
        this.startSignalRConnection();
      } 
      else if (!user && this.isConnected()) {
        this.stopSignalRConnection();
      }
    });
  }

  getUserNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.baseUrlNotifications}`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrlNotifications}/mark-as-read/${notificationId}`, {});
  }

   async startSignalRConnection(): Promise<void> {
    if (this.hubConnection) {
      return;
    }

    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${this.webSocketUrl}`, {
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
      this.hubConnection = null;
    }
  }

  async stopSignalRConnection(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        this.hubConnection.off('ReceiveNotification');
        this.hubConnection = null;
        this.isConnected.set(false);
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      }
    }
  }
}