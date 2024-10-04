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
export class AddAuctionComponent {
  auctionForm: FormGroup;
  selectedFiles: File[] = [];


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

  onFileChange(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    // const file = event.target.files[0]; // Get the first file from the file input
    // if (file) {
    //   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Define allowed file types
    //   if (!allowedTypes.includes(file.type)) {
    //     alert('Please upload an image in JPEG, PNG, or GIF format only.'); // Alert if the file type is not allowed
    //     this.auctionForm.patchValue({
    //       item_media: null // Reset value if type is not allowed
    //     });
    //     return; // Exit the method
    //   }

    //   // Update item_media to be the file itself instead of image data
    //   this.auctionForm.patchValue({
    //     item_media: file // Set item_media to the selected file
    //   });
    // }
  }


  onSubmit() {
    if (this.auctionForm.valid) {
      const formData = new FormData();
      // const formData = this.auctionForm.value;
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
      this.auctionService.createAuction(formData).subscribe({
        next: (response) => {
          console.log(response);
          this.auctionForm.reset();
        },
        error: (error) => {
          console.log('Error:', error);
        }
      });
    }
    console.log(this.auctionForm.valid);

    // const formData = new FormData();
    // Append form values to FormData
    // Object.keys(this.auctionForm.value).forEach(key => {
    //   const value = this.auctionForm.get(key)?.value;
    //   if (key === 'item_media') {
    //     if (value) {
    //       Data.append(key, value);
    //       console.log('Appending file:', value);
    //     }
    //   } else {
    //     Data.append(key, value || '');
    //     console.log(`Appending ${key}:`, value);
    //   }
    // });

    // // Show contents of FormData (for verification only, don't use in production)
    // formData.forEach((value, key) => {
    //   console.log(`${key}:`, value);
    // });
  }
}
