
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  userProfileImage: string = 'assets/images/user.jpeg'; 
  showDropdown: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginActive = this.router.url === '/login';
        this.isSignupActive = this.router.url === '/register';
      }
    });

    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.name; 
      this.isLoggedIn = true;  
      this.isRegistered = true;  
    }
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
    this.router.navigate(['/']); 
  }
}
