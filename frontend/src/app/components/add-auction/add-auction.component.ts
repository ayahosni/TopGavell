import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-auction',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-auction.component.html',
  styleUrls: ['./add-auction.component.css']
})
export class AddAuctionComponent {
  auctionForm: FormGroup;
  selectedFiles: File[] = [];
  categories: any[] = [];


  constructor(private fb: FormBuilder, private auctionService: AuctionService, private router: Router) {
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

  // onSubmit() {
  //   if (this.auctionForm.valid) {
  //     console.log(this.auctionForm.value); 

  //     // const formData = new FormData();
  //     var formData = this.auctionForm.value;

  //     Object.keys(this.auctionForm.value).forEach(key => {
  //       const value = this.auctionForm.get(key)?.value;
  //       if (key === 'item_media') {
  //         if (this.selectedFiles.length > 0) {
  //           this.selectedFiles.forEach(file => {
  //             formData.append('item_media[]', file, file.name); // Append files
  //           });
  //         }
  //       } else {
  //         formData.append(key, value || ''); // Append other form values
  //       }
  //     });
      
  //     console.log("formData");
  //     console.log(formData);
  //     this.auctionService.createAuction(formData).subscribe({
  //       next: (response) => {
  //         console.log('Auction created successfully!', response);

  //         // this.router.navigate(['/']);
  //         // this.auctionForm.reset();
  //       },
  //       error: (error) => {
  //         console.log('Error:', error);
  //       }
  //     });
  //   }
  //   console.log(this.auctionForm.valid);
  // }

  onSubmit() {
    if (this.auctionForm.valid) {
        console.log(this.auctionForm.value);

        // Create a new FormData instance
        const formData = new FormData(); // Use FormData

        // Append the form values to the FormData object
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

        console.log("Form Data Before Sending:", formData); // Log the FormData
        
        // Log each key-value pair using forEach
        formData.forEach((value, key) => {
          console.log(key + ': ' + value); // Log each key-value pair
        });

        // Send the formData to the backend
        this.auctionService.createAuction(formData).subscribe({
            next: (response) => {
                console.log('Auction created successfully!', response);
                // this.router.navigate(['/']);
                // this.auctionForm.reset();
            },
            error: (error) => {
                console.log('Error:', error);
            }
        });
    }
    console.log(this.auctionForm.valid);
}

}
