import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  accountService = inject(AccountService);
  model: any = {};

  login(){
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
        this.accountService.login(this.model);
      },
      error: error => {
        console.error(error);
      }
    });
  }

  logout(){
    this.accountService.logout();
  }
}
