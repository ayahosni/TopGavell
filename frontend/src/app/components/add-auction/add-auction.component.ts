import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { AuthService } from '../../services/auth.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-auction',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-auction.component.html',
  styleUrls: ['./add-auction.component.css']
})
export class AddAuctionComponent implements OnInit {
  auctionForm: FormGroup;
  selectedFiles: File[] = [];
  categories: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private router: Router,
    private authService: AuthService 
  ) {
    this.auctionForm = this.fb.group({
      category_id: ['', Validators.required],
      item_name: ['', Validators.required],
      item_description: ['', [Validators.required, Validators.minLength(15)]],
      starting_bid: ['', Validators.required],
      bid_increment: ['', Validators.required],
      auction_start_time: ['', Validators.required],
      auction_end_time: ['', [Validators.required, this.endTimeAfterStartTime()]],
      item_media: [null, Validators.required],
      item_country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Fetch categories from the backend
    this.auctionService.getCategories().subscribe(
      (data) => {
        this.categories = data; // Bind the categories to the component
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
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
              formData.append('item_media[]', file, file.name);
            });
          }
        } else {
          formData.append(key, value || '');
        }
      });

      this.auctionService.createAuction(formData).subscribe({
        next: (response) => {
          alert('Auction created successfully!');
          this.router.navigate(['/']);
          this.auctionForm.reset();
        },
        error: (error) => {
          if (error.message === "You can't create an auction, You are banned") {
            alert(error.message); 
          } else {
            alert('An error occurred. Please try again later.');
          }
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
