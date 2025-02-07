import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../_services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ReturnUserDTO } from '../_models/user.types';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-user-panel',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, BsDropdownModule, RouterLink],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css'
})
export class UserPanelComponent{
  authService = inject(AuthService);
  userService = inject(UserService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  model: any = {};




  currentUser = this.userService.currentUser;
  photoUrl = this.userService.currentUserPhoto;
  
  login(model: any) {
    this.authService.login(model).subscribe({
      next: () => this.router.navigateByUrl('/medicines'),
      error: (error) => this.toastr.error(error.Errors)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
