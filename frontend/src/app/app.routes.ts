import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuctionsComponent } from './components/auctions/auctions.component';
import { BidsComponent } from './components/bids/bids.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CommentsComponent } from './components/comments/comments.component';



export const routes: Routes = [
    {path: '', component:HomeComponent},
    {path: 'dashboard', component: DashboardComponent}, 
    {path: 'auctions', component:AuctionsComponent},
    {path: 'auction/:id', component:CommentsComponent},
    {path: 'bids', component: BidsComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent}

];
