import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-auction',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-auction.component.html',
  styleUrls: ['./edit-auction.component.css']
})
export class EditAuctionComponent implements OnInit {
  auctionForm: FormGroup;
  selectedFiles: File[] = [];
  categories: any[] = [];
  auctionId: string = '';
  auction:any;
  images: string[] = [];

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.auctionForm = this.fb.group({
      category_id: ['', Validators.required],
      item_name: ['', Validators.required],
      item_description: ['', [Validators.required, Validators.minLength(15)]],
      starting_bid: ['', Validators.required],
      bid_increment: ['', Validators.required],
      auction_start_time: ['', Validators.required],
      auction_end_time: ['', [Validators.required, this.endTimeAfterStartTime()]],
      item_media: [null],
      item_country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get auction ID from route parameters
    this.auctionId = this.route.snapshot.paramMap.get('id') || '';


    // Fetch categories from the backend
    this.auctionService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error fetching categories', error);
      }
    });

    // Fetch auction details by ID
    this.auctionService.getAuctionById(this.auctionId).subscribe({
      next: (auction) => {
        this.auction=auction
        if (auction.item_media && auction.item_media.length > 0) {
          auction.item_media.forEach((item: { path: string; }) => {
            this.images.push('http://localhost:8000/uploads/images/' + item.path);
          });
        }
        // this.auctionForm.patchValue(auction);
        this.auctionForm.patchValue({
          category_id: auction.category_id || '',
          item_name: auction.item_name || '',
          item_description: auction.item_description || '',
          starting_bid: auction.starting_bid || '',
          bid_increment: auction.bid_increment || '',
          auction_start_time: auction.auction_start_time || '',
          auction_end_time: auction.auction_end_time || '',
          item_country: auction.item_country || ''
        });

        if (auction.item_media) {
          this.selectedFiles = auction.item_media;
        }

      },
      error: (error) => {
        console.error('Error fetching auction details', error);
      }
    });
  }

  onFileChange(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  endTimeAfterStartTime() {
    return (control: AbstractControl) => {
      const formGroup = control.parent as FormGroup;
      if (!formGroup) {
        return null;
      }
      const startTime = formGroup.get('auction_start_time')?.value;
      const endTime = control.value;
      if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
        return { endTimeBeforeStartTime: true };
      }
      return null;
    };
  }

  onSubmit() {
    if (this.auctionForm.valid) {
      const formData = new FormData();
      Object.keys(this.auctionForm.value).forEach(key => {
        const value = this.auctionForm.get(key)?.value;
        if (key === 'item_media') {
          if (this.selectedFiles.length > 0) {
            this.selectedFiles.forEach(file => {
              formData.append('item_media[]', file, file.name); // Append files
            });
          }
        } else {
          formData.append(key, value || ''); // Append other form values
        }
      });

      // Call update auction API
      this.auctionService.updateAuction(Number(this.auctionId), formData).subscribe({
        next: () => {
          this.router.navigate(['/myauctions']);
        },
        error: (error) => {
          console.error('Error updating auction', error);
        }
      });
    }
  }
}
