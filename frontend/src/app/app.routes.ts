import { PaymentVerificationComponent } from './payment-verification/payment-verification.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { ContactComponent } from './contact/contact.component';
import { BidsComponent } from './bids/bids.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddAuctionComponent } from './add-auction/add-auction.component';
import { GuidesComponent } from './guides/guides.component';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';

export const routes: Routes = [
    {path: '', component:HomeComponent},
    {path: 'auctions', component:AuctionsComponent},
    {path: 'bids', component: BidsComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent }, 
    {path: 'addAuction', component: AddAuctionComponent},
    {path: 'guides', component: GuidesComponent},
    {path: 'payment-verification', component: PaymentVerificationComponent},
    {path: 'auction-details', component: AuctionDetailsComponent},

];
