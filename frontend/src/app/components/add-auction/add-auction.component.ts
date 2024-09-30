import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuctionService } from '../../services/auction.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-auction',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-auction.component.html',
  styleUrls: ['./add-auction.component.css']
})
export class AddAuctionComponent implements OnInit {  // Change the class name here
  auctionForm: FormGroup;
  auctions: any[] = [];

  constructor(private fb: FormBuilder, private auctionService: AuctionService) {
    this.auctionForm = this.fb.group({
      category_id: ['', Validators.required],
      item_name: ['', Validators.required],
      item_description: ['', Validators.required],
      starting_bid: ['', Validators.required],
      bid_increment: ['', Validators.required],
      auction_start_time: ['', Validators.required],
      auction_end_time: ['', Validators.required],
      item_media: [null, Validators.required],
      item_country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAuctions();
  }

  loadAuctions() {
    this.auctionService.getAllAuctions().subscribe(data => {
      this.auctions = data;
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('يرجى تحميل صورة بصيغة JPEG أو PNG أو GIF فقط.');
        this.auctionForm.patchValue({
          item_media: null // Reset value if type is not allowed
        });
        return;
      }
      
      // Update item_media to be the file itself instead of image data
      this.auctionForm.patchValue({
        item_media: file
      });
    }
  }
  
  onSubmit() {
    if (this.auctionForm.invalid) {
      alert('Please fill all required fields');
      return;
    }
  
    const formData = new FormData();
  
    // Append form values to FormData
    Object.keys(this.auctionForm.value).forEach(key => {
      const value = this.auctionForm.get(key)?.value;
      if (key === 'item_media') {
        if (value) {
          formData.append(key, value);
          console.log('Appending file:', value);
        }
      } else {
        formData.append(key, value || '');
        console.log(`Appending ${key}:`, value);
      }
    });
  
    // Show contents of FormData (for verification only, don't use in production)
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
  
    // Call the service to create auction
    this.auctionService.createAuction(formData).subscribe({
      next: (response) => {
        this.loadAuctions(); // Reload data after creation
        this.auctionForm.reset(); // Reset form
      },
      error: (error) => {
        console.error('Error:', error); // Log error to console
        alert('An error occurred while creating the auction.');
      }
    });
  }
}
