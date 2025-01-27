import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { UsersOnlineComponent } from "../users-online/users-online.component";
import { AccountService } from '../_services/account.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [RegisterComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  accountService = inject(AccountService);
  currentUser = this.accountService.currentUser;
  registerMode = false;

  ngOnInit(): void {}

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }
}