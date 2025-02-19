import { Component, inject } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { RouterLink, RouterLinkActive } from '@angular/router';
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
export class NavComponent {
  authService = inject(AuthService);
}
