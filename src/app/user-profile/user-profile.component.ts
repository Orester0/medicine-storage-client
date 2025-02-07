import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
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

  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  constructor(private fb: FormBuilder) {
    
  }

  currentUser = this.userService.currentUser;
  photoUrl = this.userService.currentUserPhoto;
  editMode = false;

  userForm!: FormGroup;


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
    if (this.currentUser()) {
      this.userForm.patchValue(this.currentUser()!);
    }
  }

  onPhotoClick() {
    document.getElementById('fileInput')?.click();  
  }

  

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode && this.currentUser()) {
      this.userForm.patchValue(this.currentUser()!);
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

      this.userService.uploadCurrentUserPhoto(file).subscribe({
        next: () => this.toastr.success('Photo uploaded successfully'),
        error: () => this.toastr.error('Error uploading photo')
      });

      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  }

  saveChanges() {
    if (this.userForm.valid) {
      const updatedUser: UserUpdateDTO = this.userForm.value;
      this.userService.updateCurrentUserInfo(updatedUser).subscribe({
        next: () => {
          this.toastr.success('Profile updated successfully');
          this.editMode = false;
        },
        error: () => this.toastr.error('Error updating profile')
      });
    }
  }
}
