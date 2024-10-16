import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuctionService, Auction, PaginatedAuctions } from '../../services/auction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finished-auctions',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './finished-auctions.component.html',
  styleUrls: ['./finished-auctions.component.css']
})
export class FinishedAuctionsComponent implements OnInit {
  auctions: Auction[] = [];
  filteredAuctions: Auction[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  perPage: number = 10;

  isLoggedIn: boolean = false;
  isRegistered: boolean = false;
  userName: string = '';
  isAdmin: boolean = false;

  refundResponse: any = null;


  constructor(
    private auctionService: AuctionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAuctions(this.currentPage);
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.name;
      this.isLoggedIn = true;
      this.isRegistered = true;
      if (user.role == "admin") {
        this.isAdmin = true;
      }
    }
    console.log(this.isAdmin);
  }

  loadAuctions(page: number): void {
    this.auctionService.getFinishedAuctions(page, this.perPage).subscribe({
      next: (response: PaginatedAuctions) => {
        this.auctions = response.data;
        this.filteredAuctions = [...this.auctions];  
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
      },
      error: (err) => {
        console.error('Error loading auctions:', err);
      }
    });
  }

  goToAuctionDetails(auctionId: number): void {
    this.router.navigate(['/auction-details', auctionId]);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadAuctions(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadAuctions(this.currentPage - 1);
    }
  }
  firstPage(): void {
    if (this.currentPage > 1) {
      this.loadAuctions(1); 
    }
  }
  
  lastPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadAuctions(this.totalPages);  
    }
  }

  checkAuctionStatus(auction: { auction_end_time: string | number | Date; auction_start_time: string | number | Date; }): string {
    const currentTime = new Date();
    const auctionEndTime = new Date(auction.auction_end_time);
    const isAuctionEnded = currentTime >= auctionEndTime;
    const auctionStartTime = new Date(auction.auction_start_time);
    const isAuctionStarted = currentTime >= auctionStartTime;
    const isAuctionBeforeStarting = currentTime <= auctionStartTime;
    if (isAuctionBeforeStarting) {
      return 'before starting';
    }
    if (isAuctionStarted && !isAuctionEnded) {
      return 'opened'
    }
    return 'closed'
  }

  refund(auctionId: string) {
    this.auctionService.refund(auctionId).subscribe({
      next: (response) => {
        console.log('refunded:', response);
        this.refundResponse = response;
        // {myVar === "two" ? "it's true" : "it's false"}
        alert(` ${response.error?"payment has already been refunded" : response.message}`);

        // Optionally refresh the list of auctions or perform other actions
      },
      error: (error) => {
        console.error('Error refunded:', error);
      }
    });
  }
}
