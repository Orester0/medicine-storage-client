import { Component, inject, OnInit} from '@angular/core';
import { NavComponent } from "./nav/nav.component";
import { UserService } from './_services/user.service';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './_services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavComponent, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
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
    this.authService.currentUserToken.set(user);
  }
  

}
