import { Component, inject, OnInit, HostListener } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserPanelComponent } from '../user-panel/user-panel.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { AuthService } from '../../_services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav',
  imports: [MatIconModule, BsDropdownModule, RouterLink, RouterLinkActive, UserPanelComponent, NotificationsComponent, HasRoleDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  showAdminDropdown = false;
  isMenuOpen = false;
  router = inject(Router);
  authService = inject(AuthService);
  isMobile = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  onDesktop(): boolean {
    return !this.isMobile;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.showAdminDropdown = false;
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.showAdminDropdown = false;
  }

  toggleAdminDropdown(event: Event): void {
    event.preventDefault();
    if (this.isMobile) {
      this.showAdminDropdown = !this.showAdminDropdown;
    } else {
      this.router.navigate(['/admin']);
    }
  }
}
