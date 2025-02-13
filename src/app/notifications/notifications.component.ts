import { Component, HostListener } from '@angular/core';
import { NotificationService } from '../_services/notification.service';
import { AppNotification as AppNotification} from '../_models/notification.types';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { interval } from 'rxjs/internal/observable/interval';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-notifications',
  imports: [MatIconModule, CommonModule, MatBadgeModule, MatButtonModule, 
    MatSlideToggleModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  notifications: AppNotification[] = [];
  filteredNotifications: AppNotification[] = [];
  unreadCount = 0;
  showDropdown = false;
  showReadNotifications = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const notificationContainer = document.querySelector('.notification-container');
    if (notificationContainer && !notificationContainer.contains(event.target as Node)) {
      this.showDropdown = false;
    }
  }

  ngOnInit(): void {
    if (this.authService.currentUser()) {
      this.loadNotifications();
      this.notificationService.startSignalRConnection()
        .catch(err => console.error('Failed to start SignalR:', err));

      this.subscriptions.add(
        this.notificationService.notification$.subscribe(newNotification => {
          this.notifications.unshift(newNotification);
          this.filterNotifications();
          this.unreadCount++;
        })
      );
    }
  }

  loadNotifications(): void {
    if (!this.authService.currentUser()) return;

    this.subscriptions.add(
      this.notificationService.getUserNotifications().subscribe({
        next: (data) => {
          this.notifications = data;
          this.filterNotifications();
          this.unreadCount = this.notifications.filter(n => !n.isRead).length;
        },
        error: (err) => {
          if (err.status === 401) {
            this.notifications = [];
            this.filteredNotifications = [];
            this.unreadCount = 0;
          }
        }
      })
    );
  }

  filterNotifications(): void {
    this.filteredNotifications = this.showReadNotifications 
      ? this.notifications
      : this.notifications.filter(n => !n.isRead);
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  toggleReadNotifications(event: Event): void {
    event.stopPropagation();
    this.showReadNotifications = !this.showReadNotifications;
    this.filterNotifications();
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
        this.filterNotifications();
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
      }
    });
  }

  ngOnDestroy(): void {
    this.notificationService.stopSignalRConnection();
    this.subscriptions.unsubscribe();
  }
}
