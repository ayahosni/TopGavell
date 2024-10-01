import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // To get the auction ID from the URL
import { AuctionService } from '../../services/auction.service';
import { Observable } from 'rxjs';
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

  constructor(private auctionService: AuctionService, private route: ActivatedRoute) { }

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
        console.log(this.auction);
      },
      error: (error: any) => {
        console.error('Error loading auction details:', error);
      },
    });
  }

}
