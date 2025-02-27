import { Component } from '@angular/core';
import { MedicineTrackerComponent } from '../medicine-tracker/medicine-tracker.component';
import { UserProfileInfoComponent } from '../user-profile-info/user-profile-info.component';
import { HasRoleDirective } from '../../_directives/has-role.directive';

@Component({
  selector: 'app-user-profile',
  imports: [MedicineTrackerComponent, UserProfileInfoComponent, HasRoleDirective],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

}
