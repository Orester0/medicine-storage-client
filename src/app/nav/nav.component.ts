import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { UserService } from '../_services/user.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationTemplateComponent } from '../notification-template/notification-template.component';
import { UserPanelComponent } from '../user-panel/user-panel.component';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive, NotificationTemplateComponent, UserPanelComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  authService = inject(AuthService);
}
