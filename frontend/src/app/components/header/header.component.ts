
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
  isAdmin:boolean=false;
  userProfileImage: string = 'assets/images/user.jpeg'; 
  showDropdown: boolean = false;
  notificationCount: number = 0;  

  addNotification() {
    this.notificationCount += 1; // Increment notification count
  }


  clearNotifications() {
    this.notificationCount = 0; // clear notifications when viewed
  }

  constructor(private router: Router) {}

  // ngOnInit(): void {
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       this.isLoginActive = this.router.url === '/login';
  //       this.isSignupActive = this.router.url === '/register';
  //     }
  //   });

  //   const userData = localStorage.getItem('user');
  //   console.log(userData)
  //   if (userData) {
  //     const user = JSON.parse(userData);
  //     this.userName = user.name; 
  //     this.isLoggedIn = true;  
  //     this.isRegistered = true;
  //     if(user.role=="admin"){
  //       this.isAdmin=true;
  //     }
  //   }
  //   console.log(this.isAdmin);
  // }
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
  
      // Verify role value and ensure it's correctly retrieved
      if (user.role === "admin") {
        this.isAdmin = true;
      }
    }
    console.log('Is Admin:', this.isAdmin); // Debug log
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