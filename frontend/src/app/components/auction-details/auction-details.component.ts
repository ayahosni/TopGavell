import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { ActivatedRoute } from '@angular/router'; 
import { AuctionService } from '../../services/auction.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auction-details',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {
  auctionId: string = '';
  auction: any;
  lastBid: any;
  bidAmount: number = 0; 

  constructor(private auctionService: AuctionService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
          this.auctionId = params.get('id') || '';
          this.loadAuctionDetails();
      });
  }

  loadAuctionDetails(): void {
      this.auctionService.getAuctionById(this.auctionId).subscribe({
          next: (response: any) => {
              this.auction = response;
              this.lastBid = this.auction.bids?.[this.auction.bids.length - 1];
              console.log(this.auction);
          },
          error: (error: any) => {
              console.error('Error loading auction details:', error);
          },
      });
  }

  goToBidPage(auctionId: string): void {
      this.router.navigate(['/bid', auctionId]);
  }

  placeBid(): void {
      if (this.bidAmount >= this.auction.starting_bid) {
          console.log(`Placing bid of ${this.bidAmount} USD for auction ${this.auctionId}`);
          this.lastBid = { amount: this.bidAmount, bidder: { name: 'Your Name' }, created_at: new Date() };
      } else {
          alert(`Your bid must be at least ${this.auction.starting_bid} USD.`);
      }
  }
}
