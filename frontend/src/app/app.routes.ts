import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuctionsComponent } from './components/auctions/auctions.component';
import { ContactComponent } from './components/contact/contact.component';
import { BidsComponent } from './components/bids/bids.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddAuctionComponent } from './components/add-auction/add-auction.component';
import { AuctionDetailsComponent } from './components/auction-details/auction-details.component';
import { CommentsComponent } from './components/comments/comments.component';
import { GuidesComponent } from './components/guides/guides.component';
import { EmailVerficationComponent } from './components/email-verfication/email-verfication.component';
import { authGuard } from './services/auth.guard';
import { AuctionComponent } from './components/auction/auction.component';
import { PaymentComponent } from './components/Payment/Payment.component';

export const routes: Routes = [
    {path: '', component:HomeComponent},
    {path: 'auctions', component:AuctionsComponent},
    {path: 'auction/:id', component: AuctionComponent},
    {path: 'bids', component: BidsComponent},
    {path: 'bid/:id', component: BidsComponent },
    {path: 'auction-details', component: AuctionDetailsComponent },
    {path: 'contact', component: ContactComponent},
    {path: 'login', component: LoginComponent },    
    {path: 'register', component: RegisterComponent},
    {path: 'email_verify', component: EmailVerficationComponent, canActivate: [authGuard]},
    // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {path: 'dashboard', component: DashboardComponent},
    { path: 'addAuction', component: AddAuctionComponent },
  { path: 'auction/:auctionId/comments', component: CommentsComponent }, 
    {path: 'guides', component: GuidesComponent},
    {path: 'payment', component: PaymentComponent},
    // {path: '**', redirectTo: '/login'},
];