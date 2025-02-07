import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ReturnUserDTO } from '../_models/user.types';

@Component({
  selector: 'app-user-panel',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, BsDropdownModule, RouterLink],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css'
})
export class UserPanelComponent implements OnInit {
  accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  model: any = {};

  
  currentUserDTO: ReturnUserDTO | null = null;
  photoUrl: string | null = null;


  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.accountService.getCurrentUserInfo().subscribe({
      next: user => {
        this.currentUserDTO = user;
        this.loadUserPhoto();
      },
      error: () => this.currentUserDTO = null
    });
  }

  loadUserPhoto() {
    this.accountService.getCurrentUserPhoto().subscribe({
      next: (blob: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.photoUrl = reader.result as string;
        };
      },
      error: () => this.toastr.error("Error loading profile picture")
    });
  }
  
  login(model: any) {
    this.accountService.login(model).subscribe({

      next: () => {
        this.loadUserInfo(); 
        this.router.navigateByUrl('/medicines');
      },
      error: (error) => {
        this.toastr.error(error.Errors)
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.currentUserDTO = null;
    this.photoUrl = null;
    this.router.navigateByUrl('/');
  }
}
