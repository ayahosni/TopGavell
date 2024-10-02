// auction-details.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { ActivatedRoute } from '@angular/router'; 
import { AuctionService } from '../../services/auction.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';  // خدمة التعليقات

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

  comments: any[] = [];
  newComment = {
    comment_text: ''
  };

  constructor(
    private auctionService: AuctionService, 
    private commentsService: CommentsService,  
    private route: ActivatedRoute, 
    private router: Router
  ) { }

  ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
          this.auctionId = params.get('id') || '';
          this.loadAuctionDetails();
          this.loadComments();
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


 
  loadComments(): void {
    this.commentsService.getCommentsByAuctionId(this.auctionId).subscribe({
      next: (response: any) => {
        this.comments = response.comments;
        console.log('Comments loaded:', this.comments);
      },
      error: (error: any) => {
        console.error('Error loading comments:', error);
      }
    });
  }



submitComment(): void {
    if (this.newComment.comment_text.trim() !== '') {  
        this.commentsService.createComment(this.auctionId, this.newComment).subscribe({
            next: (response: any) => {
                this.comments.push(response.comment); 
                this.newComment.comment_text = ''; 
            },
            error: (error: any) => {
                console.error('Error submitting comment:', error);
            }
        });
    } else {
        alert('Comment content cannot be empty.');
    }
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
