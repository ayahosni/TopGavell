import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuctionService } from '../../services/auction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  auctionForm: FormGroup;
  auctions: any[] = [];
  selectedAuctionId: number | null = null; // Track selected auction ID

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private authService: AuthService,
    private router: Router
  ) {
    this.auctionForm = this.fb.group({
      category_id: ['', Validators.required],
      item_name: ['', Validators.required],
      item_description: ['', Validators.required],
      starting_bid: ['', Validators.required],
      bid_increment: ['', Validators.required],
      auction_start_time: ['', Validators.required],
      auction_end_time: ['', Validators.required],
      item_media: [null],
      item_country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // if (!this.authService.isAuthenticated()) {
    //   this.router.navigate(['/login']); // Redirect to login if not authenticated
    // } else {
    //   this.loadAuctions(); // Load auctions if authenticated
    // }
  }

  // Load all auctions from the service
  loadAuctions() {
    this.auctionService.getAllAuctions().subscribe({
      next: (data: any[]) => {
        this.auctions = data;  // Store auction data
        console.log('Auctions:', this.auctions);
      },
      error: (err) => {
        console.error('Error loading auctions:', err);
        if (err.error && err.error.message === 'Token is missing. Please log in.') {
          this.authService.logOut();
          this.router.navigate(['/login']); // Redirect on token error
        }
      }
    });
  }

  // Handle file input changes
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload an image in JPEG, PNG, or GIF format.');
        this.auctionForm.patchValue({ item_media: null }); // Reset value if type is not allowed
        return;
      }
      this.auctionForm.patchValue({ item_media: file }); // Update form with selected file
    }
  }

  // Handle auction submission
  onSubmit() {
    if (this.auctionForm.invalid) {
      return; // Do not proceed if form is invalid
    }

    const formData = new FormData();
    Object.keys(this.auctionForm.value).forEach(key => {
      const value = this.auctionForm.get(key)?.value;
      if (key === 'item_media' && value) {
        formData.append(key, value); // Append file if present
      } else {
        formData.append(key, value); // Append other form values
      }
    });

    this.auctionService.createAuction(formData).subscribe({
      next: (data) => {
        console.log('Auction created:', data);
        this.loadAuctions(); // Reload auctions after successful creation
        this.auctionForm.reset(); // Reset the form
      },
      error: (error) => {
        console.error('Error creating auction:', error);
        if (error.error && error.error.message === 'Token is missing. Please log in.') {
          this.authService.logOut();
          this.router.navigate(['/login']); // Redirect on token error
        }
      }
    });
  }

  // Toggle the auction bid form
  openBidForm(auctionId: number): void {
    this.selectedAuctionId = this.selectedAuctionId === auctionId ? null : auctionId; // Toggle selection
  }

  // Handle placing a bid
  onBid(auctionId: number) {
    console.log(`Placing a bid on auction ID: ${auctionId}`);
    this.router.navigate(['/payment-verification', auctionId]); // Navigate to bid page
  }
}
