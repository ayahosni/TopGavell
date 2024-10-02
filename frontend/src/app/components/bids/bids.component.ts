import { Component, Input, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BidService } from '../../services/bid.service';
import { AuctionService } from '../../services/auction.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-bids',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.css']
})
export class BidsComponent implements OnInit {
  @Input() auctionId: string = '';
  auction: any;
  lastBid: any;
  bidAmount: number = 0;

  constructor(
    private auctionService: AuctionService,
    private route: ActivatedRoute,
    private bidService: BidService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAuctionDetails();
  }

  loadAuctionDetails(): void {
    this.auctionService.getAuctionById(this.auctionId).subscribe({
      next: (response: any) => {
        this.auction = response;
        console.log(this.auction.bids);
        this.lastBid = this.auction.bids[1] || null;
      },
      error: (error: any) => {
        console.error('Error loading auction details:', error);
      },
    });
  }

  placeBid(): void {
    localStorage.setItem('auctionIdToBidOn',this.auctionId);
    const bidInfo = {
      bid_amount: this.bidAmount,
    };
    this.bidService.placeBid(this.auctionId, this.bidAmount, bidInfo).subscribe({
      next: (response: any) => {
        console.log('Bid placed successfully', response);
      },
      error: (error: any) => {
        console.log('Error placing bid:', error.error.massage)
        if (error.error.payment == false) {
          this.router.navigate(['/payment_verification']);
        };
      }
    });
  }
}