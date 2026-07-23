import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;
  showMobileMenu = false;
  showProfileMenu = false;
  scrolled = false;

  constructor(
    public auth: Auth,
    public router: Router,
    private notificationService: NotificationService
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 10;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notif-wrapper')) {
      this.showNotifications = false;
    }
    if (!target.closest('.profile-wrapper')) {
      this.showProfileMenu = false;
    }
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.loadNotifications();
    }
  }

  shouldShowNavbar(): boolean {
    const url = this.router.url;
    if (url.includes('/login') || url.includes('/register') || url.includes('/admin/dashboard') || url.includes('/donor/dashboard')) {
      return false;
    }
    return this.auth.isLoggedIn();
  }

  loadNotifications() {
    const user = this.auth.currentUserSignal();
    const userId = user ? user.userId : undefined;
    this.notificationService.getNotifications(userId).subscribe({
      next: (res) => {
        this.notifications = res.slice(0, 8);
        this.unreadCount = res.filter((n: any) => !n.isRead).length;
      },
      error: () => {}
    });
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    this.showProfileMenu = false;
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotifications = false;
  }

  markRead(id: number) {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const item = this.notifications.find((n: any) => n.notificationId === id);
        if (item) item.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.showProfileMenu = false;
    this.showMobileMenu = false;
    this.router.navigate(['/login']);
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  getUserInitial(): string {
    const user = this.auth.currentUserSignal();
    return user ? user.fullName.charAt(0).toUpperCase() : 'U';
  }

  getUserName(): string {
    const user = this.auth.currentUserSignal();
    return user ? user.fullName : '';
  }

  getUserRole(): string {
    const user = this.auth.currentUserSignal();
    if (!user) return '';
    return user.roleId === 1 ? 'Admin' : 'Donor';
  }

  getDashboardLink(): string {
    return this.auth.isAdmin() ? '/admin/dashboard' : '/donor/dashboard';
  }
}
