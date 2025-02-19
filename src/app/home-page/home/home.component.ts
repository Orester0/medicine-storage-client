import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../_services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { RegisterComponent } from '../register/register.component';
@Component({
  selector: 'app-home',
  imports: [RegisterComponent, CommonModule, MatIconModule],
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