import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { RouterModule } from '@angular/router';
=======
import { RouterModule } from '@angular/router'; 
>>>>>>> b43b8a7 (auction status)
import { AuctionService } from '../../services/auction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  auctions: any[] = [];
  auctionId: string = '';
  auctionEndTime: Date | null = null;
  isAuctionEnded: boolean = false;
  auctionStatus: string = '';
  images: string[] = [];
  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAuctions();
  }

  loadAuctions() {
    this.auctionService.getAllAuctions().subscribe({
      next: (response: any) => {
        this.auctions = response;
        this.auctions.forEach((item) => {
          item.item_media.forEach((item: { path: any; }) => {
            this.images.push(item.path);
          });
        });

      },
      error: (error: any) => {
        console.error('Error loading auction details:', error);
      },
    });
  }

<<<<<<< HEAD
  checkAuctionStatus(auctionEndTime: string): string {
    const currentTime = new Date();
    const auctionEndDate = new Date(auctionEndTime);
    return auctionEndDate < currentTime ? 'closed' : 'opened';
  }

}
=======
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('يرجى تحميل صورة بصيغة JPEG أو PNG أو GIF فقط.');
        this.auctionForm.patchValue({
          item_media: null 
        });
        return;
      }

      this.auctionForm.patchValue({
        item_media: file
      });
    }
  }
  checkAuctionStatus(auctionEndTime: string): string {
    const currentTime = new Date();
    const auctionEndDate = new Date(auctionEndTime);
    return auctionEndDate < currentTime ? 'closed' : 'opened';
  }
  
}
  // onSubmit() {
  //   const formData = new FormData();

  //   Object.keys(this.auctionForm.value).forEach(key => {
  //     if (key === 'item_media') {
  //       formData.append(key, this.auctionForm.get('item_media')?.value);
  //     } else {
  //       formData.append(key, this.auctionForm.get(key)?.value);
  //     }
  //   });

  //   this.auctionService.createAuction(formData).subscribe({
  //     next: (data) => {
  //       console.log('Auction created:', data);
  //       this.loadAuctions(); 
  //       this.auctionForm.reset(); // إعادة تعيين النموذج بعد النجاح
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     }
  //   });
  // }

  // openBidForm(auctionId: number): void {
  //   // Toggle selected auction ID
  //   this.selectedAuctionId = this.selectedAuctionId === auctionId ? null : auctionId;
  // }

  // onBid(auctionId: number) {
  //   // Handle the logic to place a bid here
  //   console.log(`Placing a bid on auction ID: ${auctionId}`);
  //   // Call your bid service here
  // }

>>>>>>> b43b8a7 (auction status)


