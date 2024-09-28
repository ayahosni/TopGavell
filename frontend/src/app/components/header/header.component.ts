// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
// import { RouterLink, RouterLinkActive } from '@angular/router';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [RouterLink, RouterLinkActive, CommonModule],
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.css']
// })
// export class HeaderComponent implements OnInit {
//   isLoginActive: boolean = false;
//   isSignupActive: boolean = false;
//   isLoggedIn: boolean = false;
//   userName: string = '';
//   userProfileImage: string = 'assets/images/user.jpeg'; // Path to default profile image
//   showDropdown: boolean = false;

//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     // Subscribe to router events to determine if login or signup pages are active
//     this.router.events.subscribe(event => {
//       if (event instanceof NavigationEnd) {
//         this.isLoginActive = this.router.url === '/login';
//         this.isSignupActive = this.router.url === '/register';
//       }
//     });

//     // Check if user is logged in (user data is stored in localStorage)
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       const user = JSON.parse(userData);
//       this.userName = user.name;  // Set the username
//       this.isLoggedIn = true;     // Indicate that the user is logged in
//     } else {
//       this.isLoggedIn = false; // Ensure this is false when there's no user data
//     }
//   }

//   // Toggle dropdown menu visibility
//   toggleDropdown(event: Event): void {
//     event.stopPropagation(); // Stop event propagation to avoid unwanted clicks
//     this.showDropdown = !this.showDropdown;
//   }

//   // Close dropdown when clicking outside
//   closeDropdown(): void {
//     this.showDropdown = false;
//   }

//   // Method to log out and remove the user from localStorage
//   logout(): void {
//     localStorage.removeItem('user');
//     this.isLoggedIn = false;
//     this.router.navigate(['/']);
//   }
// }
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
  isRegistered: boolean = false; // Add this property
  userName: string = '';
  userProfileImage: string = 'assets/images/user.jpeg'; // Path to default profile image
  showDropdown: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Subscribe to router events to determine if login or signup pages are active
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginActive = this.router.url === '/login';
        this.isSignupActive = this.router.url === '/register';
      }
    });

    // Check if user is logged in (user data is stored in localStorage)
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.name;  // Set the username
      this.isLoggedIn = true;     // Indicate that the user is logged in
      this.isRegistered = true;    // Set registered status if user data exists
    } else {
      this.isLoggedIn = false; // Ensure this is false when there's no user data
      this.isRegistered = false; // Ensure registered status is false
    }
  }

  // Toggle dropdown menu visibility
  toggleDropdown(event: Event): void {
    event.stopPropagation(); // Stop event propagation to avoid unwanted clicks
    this.showDropdown = !this.showDropdown;
  }

  // Close dropdown when clicking outside
  closeDropdown(): void {
    this.showDropdown = false;
  }

  // Method to log out and remove the user from localStorage
  logout(): void {
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.isRegistered = false; // Reset registered status on logout
    this.router.navigate(['/']);
  }
}
