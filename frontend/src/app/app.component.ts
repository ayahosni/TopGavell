import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd, RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import { AuctionsComponent } from './components/auctions/auctions.component';
import { CommentsComponent } from './components/comments/comments.component';
import { BidComponent } from './components/bids/bids.component'; // Corrected import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    BidComponent, // Use BidComponent instead of BidsComponent
    ContactComponent,
    HomeComponent,

    AuctionsComponent,
    CommentsComponent
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
        const hideHeaderFooterRoutes = ['/login', '/register'];

        this.showHeader = !hideHeaderFooterRoutes.includes(this.router.url);
        this.showFooter = !hideHeaderFooterRoutes.includes(this.router.url);
      }
    });
  }
}

// Don't forget to use AppProviders in main.ts
export const AppProviders = [provideHttpClient()];
