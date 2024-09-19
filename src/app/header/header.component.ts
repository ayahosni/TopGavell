import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] 
})
export class HeaderComponent implements OnInit {
  isLoginActive: boolean = false;
  isSignupActive: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd:', this.router.url); // Debugging statement

        // Check the current URL and log the state
        this.isLoginActive = this.router.url === '/login';
        this.isSignupActive = this.router.url === '/register';

        console.log('isLoginActive:', this.isLoginActive);
        console.log('isSignupActive:', this.isSignupActive);
      }
    });
  }
}
