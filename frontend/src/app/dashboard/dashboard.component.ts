import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    showHeader = true;
    showFooter = true;
    showDashboard = true; // أو ضع هنا الشرط الذي يناسب حالتك
  
  startAuction() {
    console.log("Auction Started!");
  
}
}