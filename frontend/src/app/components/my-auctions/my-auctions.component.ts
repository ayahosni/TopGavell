import { Component, OnInit } from '@angular/core';
import { AuctionService, Auction, PaginatedAuctions } from '../../services/auction.service';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-auctions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-auctions.component.html',
  styleUrl: './my-auctions.component.css'
})
export class MyAuctionsComponent implements OnInit {
  auctions: Auction[] = [];
  filteredAuctions: Auction[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  perPage: number = 10;
  currentTime: Date = new Date();
  isBanned: boolean = false;
  isRegistered: boolean = false;
  userName: string = '';
  isAdmin: boolean = false;

  constructor(
    private auctionService: AuctionService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadmyAuctions();
    const userData = this.authService.getUserData();

    if (userData) {
      this.userName = userData.name; 
      this.isRegistered = true;  
      this.isAdmin = this.authService.is_admin();
      this.isBanned = this.authService.isUserBanned();
    }
  }

  /**
 * 
 * @param page 
 */
  loadmyAuctions(page: number = 1): void {
    this.auctionService.getmyAuctions(page, this.perPage).subscribe({
      next: (response: PaginatedAuctions) => {
        this.auctions = response.data;
        this.filteredAuctions = [...this.auctions];
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
      },
      error: (err) => {
        console.error('Error loading approved auctions:', err);
      }
    });
  }

  goToAuctionDetails(auctionId: string): void {
    console.log(auctionId);
    this.router.navigate(['/auction', auctionId]);
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

  

  /**
 */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  /**
   */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  /**
* @param page 
*/
  onPageChange(page: number): void {
    this.fetchAuctions(page);
  }
  /**
 * @param page 
 */
  fetchAuctions(page: number = 1): void {
    this.currentPage = page;
    this.auctionService.getmyAuctions(page, this.perPage).subscribe({
      next: (response: PaginatedAuctions) => {
        this.auctions = response.data;
        this.filteredAuctions = [...this.auctions];
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
      },
      error: (err) => {
        console.error('Error fetching auctions:', err);
      }
    });
  }

  

  updateAuction(id: any){
    console.log(id);
    this.router.navigate([`/auction/edit/${id}`]);

  }
  // deleteAuction(id: any){
  //   console.log(id);
  // }

  deleteAuction(auctionId: string) {
    this.auctionService.deleteAuction(auctionId).subscribe({
      next: (response) => {
        console.log('Auction deleted:', response);
        this.ngOnInit();
        // Optionally refresh the list of auctions or perform other actions
      },
      error: (error) => {
        console.error('Error deleting auction:', error);
      }
    });
  }

  isAuctionActive(auction: Auction): boolean {
    return new Date() < new Date(auction.auction_start_time); 
  }
  
}
