import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BidsService } from '../../services/bids.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bid',
  standalone: true,
  templateUrl: './bids.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./bids.component.css']
})
export class BidComponent implements OnInit {
  bidForm: FormGroup;
  auctionId: number = 0; // Set a default value

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Add Router for navigation
    private bidsService: BidsService,
    private formBuilder: FormBuilder
  ) {
    // Create the form
    this.bidForm = this.formBuilder.group({
      bid_amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Get auction ID from URL
    const auctionIdParam = this.route.snapshot.paramMap.get('id');
    this.auctionId = auctionIdParam ? +auctionIdParam : 0; // Default value if not present
  }

  // Function to submit the bid
  onSubmit(): void {
    if (this.bidForm.valid) {
      const bidAmount = this.bidForm.value.bid_amount;
      this.bidsService.placeBid(this.auctionId, bidAmount).subscribe({
        next: response => {
          console.log('Bid placed successfully:', response);
          // Handle successful bid placement (e.g., navigate or show a message)
        },
        error: error => {
          console.error('Error placing bid:', error);
          // Handle error (e.g., show an error message)
        }
      });
    }
  }
}
