import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BidsComponent } from './bids/bids.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GuidesComponent } from './guides/guides.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [

    RouterOutlet, CommonModule, RouterLink, RouterLinkActive, HeaderComponent,
    FooterComponent, FontAwesomeModule, BidsComponent, ContactComponent, HomeComponent, FormsModule,  GuidesComponent
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

export const AppProviders = [provideHttpClient()];
