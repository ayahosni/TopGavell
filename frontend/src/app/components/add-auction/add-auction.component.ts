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
export class AddAuctionComponent implements OnInit {
  auctionForm: FormGroup;
  selectedFiles: File[] = [];


  constructor(private fb: FormBuilder, private auctionService: AuctionService, private router: Router) {
    this.auctionForm = this.fb.group({
      category_id: ['', Validators.required],
      item_name: ['', Validators.required],
      item_description: ['', Validators.required],
      starting_bid: ['', Validators.required],
      bid_increment: ['', Validators.required],
      auction_start_time: ['', Validators.required],
      auction_end_time: ['', [Validators.required, this.endTimeAfterStartTime()]],
      item_media: [null, Validators.required],
      item_country: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image format (JPEG, PNG, GIF).');
        this.auctionForm.patchValue({ item_media: null });
        return;
      }
      this.auctionForm.patchValue({ item_media: file });
    }
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
    if (this.auctionForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    Object.keys(this.auctionForm.value).forEach(key => {
      const value = this.auctionForm.get(key)?.value;
      if (key === 'item_media') {
        if (value) {
          formData.append(key, value);
        }
      } else {
        formData.append(key, value || '');
      }
    });

    this.auctionService.createAuction(formData).subscribe({
      next: (response) => {
        this.auctionForm.reset(); // Reset form
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
