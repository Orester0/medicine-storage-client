import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ReturnUserDTO } from '../../_models/user.types';
import { UserFullNamePipe } from '../../_pipes/user-full-name.pipe';

@Component({
  selector: 'app-user-info',
  imports: [CommonModule, MatIconModule, UserFullNamePipe],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  @Input() user: ReturnUserDTO | null = null;
  @Input() isOpen = false;
  @Input() onClose: () => void = () => {};

  close(): void {
    this.onClose();
  }
}
