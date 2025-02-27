import { Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './_services/auth.service';
import { NavComponent } from './header/nav/nav.component';
import { TitleService } from './_services/title.service';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
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
  private titleService = inject(TitleService); 
  private activatedRoute = inject(ActivatedRoute);

  
  constructor(){
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child?.firstChild) {
            child = child.firstChild;
          }
          return child?.snapshot.data['title'] || 'Medicine Storage';
        })
      )
      .subscribe((pageTitle) => {
        this.titleService.setTitle(pageTitle);
      });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserInfo(true).subscribe(() => {
      console.log('User data initialized');
    });
  }

  ngOnDestroy(): void {

  }

}
