import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { CommonModule } from '@angular/common';
import { ReturnUserDTO, UserUpdateDTO } from '../_models/user.types';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit  {
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);

  currentUser = this.authService.currentUser;
  photoUrl = this.authService.currentUserPhoto;
  editMode = false;
  userEditForm!: FormGroup;

  private initializeForm() {
    const user = this.currentUser();
    this.userEditForm = this.fb.group({
      firstName: [user?.firstName || ''],
      lastName: [user?.lastName || ''],
      position: [user?.position || ''],
      company: [user?.company || ''],
      email: [user?.email || '']
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onPhotoClick() {
    document.getElementById('fileInput')?.click();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode && this.currentUser()) {
      this.userEditForm.patchValue(this.currentUser()!);
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

      this.authService.uploadCurrentUserPhoto(file).subscribe({
        next: () => {
          this.toastr.success('Photo uploaded successfully');
          this.authService.getCurrentUserPhoto().subscribe();
        },
        error: () => this.toastr.error('Error uploading photo')
      });

      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  }

  saveChanges() {
    if (this.userEditForm.valid) {
      const updatedUser: UserUpdateDTO = this.userEditForm.value;
      this.authService.updateCurrentUserInfo(updatedUser).subscribe({
        next: () => {
          this.toastr.success('Profile updated successfully');
          this.editMode = false;
          this.authService.getCurrentUserInfo().subscribe();
        },
        error: () => this.toastr.error('Error updating profile')
      });
    }
  }
}
