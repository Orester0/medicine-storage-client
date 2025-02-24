import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../_services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { RegisterComponent } from '../register/register.component';
import { UserRegistrationDTO } from '../../_models/user.types';
@Component({
  selector: 'app-home',
  imports: [RegisterComponent, CommonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);

  currentUser = computed(() => this.authService.currentUser());
  currentUserToken = computed(() => this.authService.currentUserToken());

  registerMode = false;
  isLoading = false;

  ngOnInit(): void {}

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  onFormSubmit(formData: UserRegistrationDTO): void {
    this.isLoading = true;
    
    this.authService.register(formData).subscribe({
      next: () => {
        this.registerMode = false;
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.registerMode = false;
  }
}