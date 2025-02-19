import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UserFullNamePipe } from '../../_pipes/user-full-name.pipe';
import { UserLoginDTO } from '../../_models/user.types';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-user-panel',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, BsDropdownModule, RouterLink, UserFullNamePipe ],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css'
})
export class UserPanelComponent{
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  model: UserLoginDTO = { userName: '', password: '' };
  
  currentUser = computed(() => this.authService.currentUser());
  photoUrl = computed(() => this.authService.currentUserPhoto());
  isAuthenticated = computed(() => !!this.authService.currentUser());

  login() {
    this.authService.login(this.model).subscribe({
      next: () => {
        this.toastr.success('Login successful');
        this.router.navigateByUrl('/medicines');
      },
      error: (error) => this.toastr.error(error.error || 'Login failed')
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
