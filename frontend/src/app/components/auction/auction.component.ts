import { Component, OnInit } from '@angular/core';
import { AuctionDetailsComponent } from "../auction-details/auction-details.component";
import { BidsComponent } from "../bids/bids.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from "../comments/comments.component";
import { AuctionService } from '../../services/auction.service';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [AuctionDetailsComponent, BidsComponent, RouterModule, FormsModule, ReactiveFormsModule, CommonModule, CommentsComponent],
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {
  auctionId: string = '';
  auction: any;
  auctionEndTime: Date | null = null;
  isAuctionEnded: boolean = false;
  winner: any;
  winingBid: any;
  winnerId: any;
  isWinner: boolean | null = null;
  hasPaid: boolean | null = null;
  fullpayment: boolean | null = null;
  private stripe: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auctionService: AuctionService,
    private paymentService: PaymentService
  ) { this.stripe = (window as any).Stripe(environment.stripeKey); }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.auctionId = params.get('id') || '';
      this.loadAuctionDetails();
    });
    this.checkIfBidderPaid(this.auctionId);
  }

  loadAuctionDetails() {
    this.auctionService.getAuctionById(this.auctionId).subscribe({
      next: (response) => {
        this.auction = response;
        this.auctionEndTime = new Date(this.auction.auction_end_time);
        this.winner = this.auction.winning_bidder.name;
        this.winnerId = this.auction.winning_bidder.id;
        this.winingBid = this.auction.winning_bid;
        this.checkAuctionStatus();
        this.is_winner(this.winnerId);
        console.log(this.winner)
        console.log(this.isWinner)
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  checkAuctionStatus() {
    const currentTime = new Date();
    this.isAuctionEnded = this.auctionEndTime ? this.auctionEndTime < currentTime : false;
  }

  is_winner(winnerId: any) {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.isWinner = false;
      if (user.id == winnerId && this.winner) {
        this.isWinner = true;
      }
    }
  }
  pay() {

    this.paymentService.createCheckoutSession(this.auctionId).subscribe((response) => {
      this.stripe.redirectToCheckout({ sessionId: response.id }).then((result: any) => {
        if (result.error) {
          console.log(result.error.message);
        }
      });
    });
  }

  checkIfBidderPaid(auctionId: any) {
    this.paymentService.checkPayment(auctionId).subscribe({
      next: (response) => {
        if (response.hasPaid === true && response.payment_type === 'full') {
          this.fullpayment = true
        } else {
          this.fullpayment = false
        }
      },
      error: (error) => {
        this.hasPaid = false;
      }
    });
  }
}
