import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { ContactComponent } from './contact/contact.component';
import { BidsComponent } from './bids/bids.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';


export const routes: Routes = [
    {path: '', component:HomeComponent},
    { path: 'dashboard', component: DashboardComponent }, 
    {path: 'auctions', component:AuctionsComponent},
    {path: 'bids', component: BidsComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent}

];
