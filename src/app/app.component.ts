import { Component, inject, OnInit} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './_services/auth.service';
import { NavComponent } from './header/nav/nav.component';
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
    this.authService.getCurrentUserInfo(true).subscribe(() => {
      console.log('User data initialized');
    });
    this.router.navigate(['/']);
    
  }

  ngOnDestroy(): void {

  }

}
