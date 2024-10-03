import { Component, OnInit } from '@angular/core';
import { AuctionDetailsComponent } from "../auction-details/auction-details.component";
import { BidsComponent } from "../bids/bids.component";
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from "../comments/comments.component";

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [AuctionDetailsComponent, BidsComponent, RouterModule, FormsModule, ReactiveFormsModule, CommonModule, CommentsComponent],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css'
})
export class AuctionComponent implements OnInit {
  auctionId: string = '';
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.auctionId = params.get('id') || '';
    });
  }
}