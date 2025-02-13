import { Component, inject, OnInit} from '@angular/core';
import { NavComponent } from "./nav/nav.component";
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './_services/auth.service';
import { filter } from 'rxjs/internal/operators/filter';
import { HasRoleDirective } from './_directives/has-role.directive';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavComponent, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  title = 'Medicine Storage';

  constructor() {
    
  }

  ngOnInit(): void {
    this.authService.getCurrentUserInfo().subscribe(() => {
      console.log('User data initialized');
    });
    this.router.navigate(['/']);
    
  }

  ngOnDestroy(): void {

  }

}
