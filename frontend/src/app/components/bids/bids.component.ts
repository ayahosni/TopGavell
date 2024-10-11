import { Component, Input, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Bid, BidService } from '../../services/bid.service';
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
  ceatorID: any;
  lastBid: any;
  bidAmount: number = 0;
  message: string = '';
  hasPaid: boolean | null = null;
  canBid: boolean | null = null;
  loading = false;
  bids:Bid[]=[];
  auctionEndTime: Date | null = null;
  auctionStartTime: Date | null = null;
  isAuctionEnded: boolean = false;
  isAuctionStarted: boolean = false;

  constructor(
    private auctionService: AuctionService,
    private route: ActivatedRoute,
    private bidService: BidService,
    private router: Router,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.loadAuctionDetails();
    this.loadAuctionBids();
    this.checkIfBidderPaid(this.auctionId);
  }

  checkIfBidderPaid(auctionId: any) {
    this.paymentService.checkPayment(auctionId).subscribe({
      next: (response) => {
        this.hasPaid = response.hasPaid;
        // console.log('payment:'+this.hasPaid);
      },
      error: (error) => {
        console.error('Error checking payment:', error);
        this.hasPaid = false;
      }
    });
  }

  loadAuctionBids(){
    this.loading = true;
    this.bidService.getBidsByAuctionId(this.auctionId).subscribe({
      next:(response)=>{
        this.loading = false;
        this.bids =response.data
        console.log(this.bids);
      }
    })
  }

  loadAuctionDetails(): void {
    this.loading = true;
    this.auctionService.getAuctionById(this.auctionId).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.auction = response;
        console.log(this.auction.bids);
        this.ceatorID = this.auction.creator.id;
        this.canbid(this.ceatorID);
        const currentTime = new Date();
        this.auctionEndTime = new Date(this.auction.auction_end_time);
        this.isAuctionEnded = currentTime >= this.auctionEndTime;
        this.auctionStartTime = new Date(this.auction.auction_start_time);
        this.isAuctionStarted = currentTime >= this.auctionStartTime;
        console.log(
          'currentTime===>'+currentTime+'\n'+
          'auctionEndTime===>'+this.auctionEndTime+'\n'+
          'isAuctionEnded===>'+this.isAuctionEnded+'\n'+
          'auctionStartTime===>'+this.auctionStartTime+'\n'+
          'isAuctionStarted===>'+this.isAuctionStarted
        )
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error loading auction details:', error);
      },
    });
  }

  payment(){
    localStorage.setItem('auctionIdToBidOn', this.auctionId);
    this.router.navigate(['/payment']);
  }
  placeBid(): void {
    this.message = '';
    this.loading = true;
    this.bidService.placeBid(this.auctionId, this.bidAmount).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.message = 'Bid placed successfully!';
        this.loadAuctionDetails();
      },
      error: (error: any) => {
        this.loading = false;
        if(error.error.bid_amount){
          this.message = ('Error in bid_amount:' + error.error.bid_amount)
        }else{
          this.message = ('Error placing bid:' + error.error.message)
        }
      }
    });
  }

  canbid(ceatorID: any) {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role == "admin" || user.id == ceatorID) {
        this.canBid = false;
      } else {
        this.canBid = true;
      }
    }
  }

}