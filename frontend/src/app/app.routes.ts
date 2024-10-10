import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuctionsComponent } from './components/auctions/auctions.component';
import { ContactComponent } from './components/contact/contact.component';
import { BidsComponent } from './components/bids/bids.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/adminDashboard/adminDashboard.component';
import { AddAuctionComponent } from './components/add-auction/add-auction.component';
import { AuctionDetailsComponent } from './components/auction-details/auction-details.component';
import { CommentsComponent } from './components/comments/comments.component';
import { GuidesComponent } from './components/guides/guides.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EmailVerficationComponent } from './components/email-verfication/email-verfication.component';
import { authGuard } from './guards/auth.guard';
import { AuctionComponent } from './components/auction/auction.component';
import { PaymentComponent } from './components/Payment/Payment.component';
import { noAuthGuard } from './guards/no-auth.guard';
import { verifyemailGuard } from './guards/verifyemail.guard';
import { ErrorsComponent } from './components/errors/errors.component';
import { adminGuard } from './guards/admin.guard';
import { PendingAuctionsComponent } from './components/pending-auctions/pending-auctions.component';
import { DeletedAuctionsComponent } from './components/deleted-auctions/deleted-auctions.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { MyAuctionsComponent } from './components/my-auctions/my-auctions.component';
import { FinishedAuctionsComponent } from './components/finished-auctions/finished-auctions.component';
import { NotificationComponent } from './components/notifications/notifications.component';

export const routes: Routes = [
    {path: '', component:HomeComponent},
    {path: 'auctions', component:AuctionsComponent, },
    {path: 'auction/:id', component: AuctionComponent, },
    {path: 'bids', component: BidsComponent , canActivate: [verifyemailGuard]},
    {path: 'bid/:id', component: BidsComponent , canActivate: [verifyemailGuard]},

    { path: 'profile', component: ProfileComponent ,canActivate:[verifyemailGuard]},
   {path: 'auction-details/:id', component: AuctionDetailsComponent , canActivate: [verifyemailGuard]},
    {path: 'contact', component: ContactComponent, canActivate: [verifyemailGuard]},
    {path: 'login', component: LoginComponent, canActivate: [noAuthGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [noAuthGuard]},
    {path: 'email_verify', component: EmailVerficationComponent, canActivate: [authGuard]},
    {path: 'adminDashboard', component: AdminDashboardComponent, canActivate: [adminGuard]},
    {path: 'userDashboard', component: UserDashboardComponent, canActivate: [verifyemailGuard]},
    {path: 'addAuction', component: AddAuctionComponent , canActivate: [verifyemailGuard]},
    {path: 'auction/:auctionId/comments', component: CommentsComponent, canActivate: [verifyemailGuard]},
    {path: 'guides', component: GuidesComponent, canActivate: [verifyemailGuard]},
    {path: 'payment', component: PaymentComponent, canActivate: [verifyemailGuard]},
    {path: 'myauctions', component: MyAuctionsComponent, canActivate: [verifyemailGuard]},
    {path: 'pendingAuctions',component:PendingAuctionsComponent,canActivate:[adminGuard]},
    {path: 'deletedAuctions',component:DeletedAuctionsComponent,canActivate:[adminGuard]},
    {path: 'errors', component: ErrorsComponent},
    { path: 'finished-auctions', component: FinishedAuctionsComponent },
    // { path: 'auctions/:id', component: AuctionDetailsComponent }
    { path: 'notifications', component: NotificationComponent, canActivate: [verifyemailGuard] },

    {path: '**', redirectTo: '/errors'},





];
