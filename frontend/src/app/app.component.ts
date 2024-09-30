import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BidsComponent } from './components/bids/bids.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { AuctionsComponent } from './components/auctions/auctions.component'; 
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';  
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GuidesComponent } from './components/guides/guides.component';
import { EmailVerficationComponent } from './components/email-verfication/email-verfication.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HeaderComponent,
    FooterComponent,
    FontAwesomeModule,
    BidsComponent,
    ContactComponent,
    HomeComponent,
    AuctionsComponent,
    FormsModule,
    GuidesComponent,
    DashboardComponent,
    EmailVerficationComponent
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
        const hideHeaderFooterRoutes = ['/login', '/register',];

        this.showHeader = !hideHeaderFooterRoutes.includes(this.router.url);
        this.showFooter = !hideHeaderFooterRoutes.includes(this.router.url);
      }
    });
  }
}

export const AppProviders = [provideHttpClient()];
