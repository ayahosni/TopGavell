import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AuctionService, Auction, PaginatedAuctions } from '../../services/auction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './adminDashboard.component.html',
  styleUrl: './adminDashboard.component.css'
})
export class AdminDashboardComponent {
  Pauctions: Auction[] = [];
  Aauctions: Auction[] = [];
  Fauctions: Auction[] = [];
  Dauctions: Auction[] = [];
  constructor(private authService: AuthService,private auctionService: AuctionService,private router: Router) { }

  ngOnInit(): void {
    this.loadPendingAuctions();
    this.loadActiveAuctions();
  }
    /**
   * 
   * @param page 
   */
    loadPendingAuctions(page: number = 1): void {
      this.auctionService.getPendingAuctions(page).subscribe({
        next: (response: PaginatedAuctions) => {
          this.Pauctions = response.data;
        },
        error: (err) => {
          console.error('Error loading approved auctions:', err);
        }
      });
    }

    loadActiveAuctions(page: number = 1): void {
      this.auctionService.getActiveAuctions(page).subscribe({
        next: (response: PaginatedAuctions) => {
          this.Aauctions = response.data;
        },
        error: (err) => {
          console.error('Error loading approved auctions:', err);
        }
      });
    }
    goToAuctions(): void {
      console.log("Navigating to auctions page");
      this.router.navigate(['/auctions']);
    }
}
