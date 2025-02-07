import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { CommonModule } from '@angular/common';
import { ReturnUserDTO, UserUpdateDTO } from '../_models/user.types';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit  {
  user: ReturnUserDTO | null = null;
  photoUrl: string | null = null;
  editMode = false;

  userForm!: FormGroup;

  constructor(private accountService: AccountService, private fb: FormBuilder, private toastr: ToastrService) {
    
  }

  private initializeForm(){
    this.userForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      position: [''],
      email: ['']
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.accountService.getCurrentUserInfo().subscribe(user => {
      this.user = user;
      this.userForm.patchValue(user);
      this.loadPhoto(true);
    });
  }

  loadPhoto(forceReload = false) {
    this.accountService.getCurrentUserPhoto().subscribe(blob => {
      if (forceReload && this.photoUrl) {
        URL.revokeObjectURL(this.photoUrl);
      }
      this.photoUrl = URL.createObjectURL(blob);
    });
  }

  onPhotoClick() {
    document.getElementById('fileInput')?.click();  
  }

  

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.userForm.patchValue(this.user!); 
    }
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
  
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
  
    img.onload = () => {
      if (img.width < 256 || img.height < 256) {
        this.toastr.error('Photo should be at least 256x256');
        URL.revokeObjectURL(objectUrl);
        return;
      }
  
      this.accountService.uploadCurrentUserPhoto(file).subscribe({
        next: () => {
          this.toastr.success('Photo uploaded successfully');
          this.loadPhoto(true);
        },
        error: (error) => {
          const errorMessage = 'Error uploading photo';
          this.toastr.error(errorMessage);

        }
      });
  
      URL.revokeObjectURL(objectUrl);
    };
  
    img.src = objectUrl;
  }
  
  saveChanges() {
    if (this.userForm.valid) {
      const updatedUser: UserUpdateDTO = this.userForm.value;
      this.accountService.updateCurrentUserInfo(updatedUser).subscribe({
        next: () => {
          this.toastr.success('Profile updated successfully');
          this.loadUserInfo();
          this.editMode = false;
        },
        error: (error) => {
          const errorMessage = 'Error updating profile';              
          this.toastr.error(errorMessage);
        }
      });
    }
  }
}
