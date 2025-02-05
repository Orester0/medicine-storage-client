import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../_services/signalr.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-users-online',
  imports: [AsyncPipe],
  templateUrl: './users-online.component.html',
  styleUrl: './users-online.component.css',
})

export class UsersOnlineComponent implements OnInit {
  
  //onlineUsers$: Observable<string[]>;
  constructor(private signalRService: SignalRService) {
    //console.log('UsersOnlineComponent constructor called');
    //this.onlineUsers$ = this.signalRService.onlineUsers$;
  }

  ngOnInit() {}
}
