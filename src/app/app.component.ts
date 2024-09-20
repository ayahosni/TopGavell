import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BidsComponent } from './bids/bids.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, CommonModule, RouterLink, RouterLinkActive, HeaderComponent,
    FooterComponent, FontAwesomeModule, BidsComponent, ContactComponent, HomeComponent, FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Fix from styleUrl to styleUrls
})
export class AppComponent implements OnInit {
  showHeader: boolean = true;
  showFooter: boolean = true;  // Add showFooter property

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hideHeaderFooterRoutes = ['/login', '/register'];  // Define routes for hiding both header and footer

        this.showHeader = !hideHeaderFooterRoutes.includes(this.router.url);
        this.showFooter = !hideHeaderFooterRoutes.includes(this.router.url);
      }
    });
  }
}
