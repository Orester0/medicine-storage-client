import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { UserService } from '../_services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../_services/auth.service';
@Component({
  selector: 'app-home',
  imports: [RegisterComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  currentUserToken = this.authService.currentUserToken;
  currentUser = this.authService.currentUser;
  registerMode = false;

  ngOnInit(): void {}

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }
}