
import { PaymentVerificationComponent } from './components/payment-verification/payment-verification.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuctionsComponent } from './components/auctions/auctions.component';
import { ContactComponent } from './components/contact/contact.component';
import { BidComponent } from './components/bids/bids.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddAuctionComponent } from './components/add-auction/add-auction.component';
import { GuidesComponent } from './components/guides/guides.component';

export const routes: Routes = [
    {path: '', component:HomeComponent},
    {path: 'auctions', component:AuctionsComponent},
    {path: 'bids', component: BidComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent }, 
    {path: 'addAuction', component: AddAuctionComponent},
    {path: 'guides', component: GuidesComponent},
    {path: 'payment-verification', component: PaymentVerificationComponent},

];
