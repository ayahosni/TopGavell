import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { ActivatedRoute } from '@angular/router'; 
import { BidService } from '../../services/bid.service';
import { AuctionService } from '../../services/auction.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bids',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.css']
})
export class BidsComponent implements OnInit {
  auctionId: string = '';
  auction: any;
  lastBid: any;
  bidAmount: number = 0; 

  constructor(
    private auctionService: AuctionService,
    private route: ActivatedRoute,
    private bidService: BidService,
    private router: Router
  ) {}

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

  placeBid(): void {
    if (this.auction && this.auction.starting_bid != null && this.bidAmount >= this.auction.starting_bid) {
      const bidInfo = { 
        auctionId: this.auctionId,
        bid_amount: this.bidAmount, 
        bidder: { name: 'Your Name' } 
      };

      this.bidService.placeBid(this.auctionId, this.bidAmount, bidInfo).subscribe({
        next: (response: any) => {
          console.log('Bid placed successfully', response); 
          this.lastBid = { amount: this.bidAmount, bidder: { name: 'Your Name' }, created_at: new Date() }; 
          alert('Your bid has been successfully placed.'); 
        },
        error: (error: any) => {
          console.error('Error placing bid:', error); 
          alert('There was an error placing your bid. Please try again.'); 
        },
      });
    } else if (this.auction.starting_bid == null) {
      alert('Unable to retrieve starting bid. Please try again.'); 
    } else {
      alert(`Your bid must be at least ${this.auction.starting_bid} USD.`); 
    }
  }
}
