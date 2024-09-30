import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // To get the auction ID from the URL
import { AuctionService } from '../../services/auction.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})export class AuctionDetailsComponent implements OnInit {
  auctionId: string = ''; // الـ auction_id الذي سيتم الحصول عليه من URL أو Parameter
  auction: any; // لحفظ تفاصيل المزاد

  constructor(private auctionService: AuctionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // الحصول على الـ auction_id من الـ URL
    this.route.paramMap.subscribe(params => {
      this.auctionId = params.get('id') || '';
      this.loadAuctionDetails();
    });
  }
  loadAuctionDetails(): void {
    this.auctionService.getAuctionById(this.auctionId).subscribe({
      next: (response: any) => {
        this.auction = response;
        console.log(this.auction); // عرض تفاصيل المزاد في الكونسول لأغراض التصحيح
      },
      error: (error: any) => {
        console.error('Error loading auction details:', error);
      },
      complete: () => {
        console.log('Auction details loaded successfully.');
      }
    });
  }
  
}
