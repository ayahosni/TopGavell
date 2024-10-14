import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoginActive: boolean = false;
  isSignupActive: boolean = false;
  isLoggedIn: boolean = false;
  isRegistered: boolean = false;
  userName: string = '';
  isAdmin: boolean = false;
  isBanned: boolean = false;
  userProfileImage: string = 'assets/images/user.jpeg'; 
  showDropdown: boolean = false;
  notificationCount: number = 0;  

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginActive = this.router.url === '/login';
        this.isSignupActive = this.router.url === '/register';
      }
    });

    this.isLoggedIn = this.authService.isLoggedIn();
    const userData = this.authService.getUserData();
    
    if (userData) {
      this.userName = userData.name; 
      this.isRegistered = true;  
      this.isAdmin = this.authService.is_admin();
      this.isBanned = this.authService.isUserBanned();
    }
    
    console.log('Is Admin:', this.isAdmin);
    console.log('Is Banned:', this.isBanned);
  }

  addNotification() {
    this.notificationCount += 1; 
  }

  clearNotifications() {
    this.notificationCount = 0; 
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.isRegistered = false;
    this.isAdmin = false;
    this.isBanned = false;

    this.router.navigate(['/']);
  }
}
