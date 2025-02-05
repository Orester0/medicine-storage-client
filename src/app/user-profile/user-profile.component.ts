import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit  {

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadPhoto();
  }

  photoUrl: any;
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.accountService.uploadPhoto(file).subscribe(() => {
        this.loadPhoto();
      });
    }
  }

  

  loadPhoto() {
    this.accountService.getPhoto().subscribe(blob => {
      const objectURL = URL.createObjectURL(blob);
      this.photoUrl = objectURL;
    });
  }
}
