import { Component, inject, OnInit} from '@angular/core';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_services/account.service';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicineService } from './_services/medicine.service';
import { TenderService } from './_services/tender.service';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from './_forms/text-input/text-input.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavComponent, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);

  title = 'Medicine Storage Client';


  ngOnInit(): void {
    this.toastr.clear();
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) {
      return;
    }
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }
  

}
