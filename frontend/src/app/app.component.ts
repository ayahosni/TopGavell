import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd, RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BidsComponent } from './components/bids/bids.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { AuctionsComponent } from './components//auctions/auctions.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    FormsModule,
    BidsComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    AuctionsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  
})
export class AppComponent implements OnInit {
  showHeader: boolean = true;
  showFooter: boolean = true;  

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hideHeaderFooterRoutes = ['/login', '/register'];  // تعريف المسارات لإخفاء كل من الهيدر والفوتر

        this.showHeader = !hideHeaderFooterRoutes.includes(this.router.url);
        this.showFooter = !hideHeaderFooterRoutes.includes(this.router.url);
      }
    });
  }
}

// لا تنسى استخدام AppProviders في main.ts
export const AppProviders = [provideHttpClient()];
