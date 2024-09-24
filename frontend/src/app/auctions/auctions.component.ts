import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuctionService } from '../services/auction.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auctions',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.css']
})
export class AuctionsComponent implements OnInit {
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
      item_media: [null],
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
          item_media: null // إعادة تعيين القيمة إذا كان النوع غير مسموح
        });
        return;
      }
      
      // يتم تحديث قيمة item_media لتكون الملف نفسه بدلاً من بيانات الصورة
      this.auctionForm.patchValue({
        item_media: file
      });
    }
  }
  
  onSubmit() {
    const formData = new FormData();

    // Append form values to FormData
    Object.keys(this.auctionForm.value).forEach(key => {
      // إذا كانت القيمة هي ملف، أضفها مباشرة
      if (key === 'item_media') {
        formData.append(key, this.auctionForm.get('item_media')?.value);
      } else {
        formData.append(key, this.auctionForm.get(key)?.value);
      }
    });

    // Call the service to create auction
    this.auctionService.createAuction(formData).subscribe(response => {
      this.loadAuctions();
      this.auctionForm.reset();
    });
  }
}
