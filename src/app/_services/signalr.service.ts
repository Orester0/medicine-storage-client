import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  private onlineUsers = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsers.asObservable();

  constructor() {
    console.log('SignalRService constructor called');
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`http://localhost:7215/userHub`)
      .withAutomaticReconnect()
      .build();
    
    this.startConnection();
    this.addListeners();
  }

  private startConnection() {
    this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
        this.getOnlineUsers();
      })
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  private addListeners() {
    this.hubConnection.on('UserConnected', (username: string) => {
      const currentUsers = this.onlineUsers.value;
      if (!currentUsers.includes(username)) {
        this.onlineUsers.next([...currentUsers, username]);
      }
    });

    this.hubConnection.on('UserDisconnected', (username: string) => {
      const currentUsers = this.onlineUsers.value;
      this.onlineUsers.next(currentUsers.filter(u => u !== username));
    });

    this.hubConnection.on('ReceiveOnlineUsers', (users: string[]) => {
      this.onlineUsers.next(users);
    });
  }

  getOnlineUsers() {
    this.hubConnection.invoke('GetOnlineUsers');
  }
}