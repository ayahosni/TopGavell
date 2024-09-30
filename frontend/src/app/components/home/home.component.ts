import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { AuctionService } from '../../services/auction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,RouterModule],
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
    this.loadAuctions();
  }

  loadAuctions() {
    this.auctionService.getAllAuctions().subscribe({
      next: (data: any[]) => {
        this.auctions = data;  
        console.log('Auctions:',this.auctions);
      },

      error: (err) => {
        console.error('Error loading auctions:', err);
        
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('يرجى تحميل صورة بصيغة JPEG أو PNG أو GIF فقط.');
        this.auctionForm.patchValue({
          item_media: null // إعادة تعيين القيمة إذا كان النوع غير مسموح
        });
        return;
      }

      this.auctionForm.patchValue({
        item_media: file
      });
    }
  }

  onSubmit() {
    const formData = new FormData();

    Object.keys(this.auctionForm.value).forEach(key => {
      if (key === 'item_media') {
        formData.append(key, this.auctionForm.get('item_media')?.value);
      } else {
        formData.append(key, this.auctionForm.get(key)?.value);
      }
    });

    this.auctionService.createAuction(formData).subscribe({
      next: (data) => {
        console.log('Auction created:', data);
        this.loadAuctions(); 
        this.auctionForm.reset(); // إعادة تعيين النموذج بعد النجاح
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  openBidForm(auctionId: number): void {
    // Toggle selected auction ID
    this.selectedAuctionId = this.selectedAuctionId === auctionId ? null : auctionId;
  }

  onBid(auctionId: number) {
    // Handle the logic to place a bid here
    console.log(`Placing a bid on auction ID: ${auctionId}`);
    // Call your bid service here
  }
}

