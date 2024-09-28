
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auction-details',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './auction-details.component.html',
  styleUrl: './auction-details.component.css'
})

export class AuctionDetailsComponent {
  isPopupOpen: boolean = false;

  formData = {
    name: 'Nour',
    email: 'norabotaleb25@gmail.com',
    phone: '(100) 947-6744',
    subject: 'Floral Art In Bamboo-Style Frame',
    message: ''
  };

  openPopup() {
    console.log('Popup is opening'); 

    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  images = [
    'assets/images/bird3.jpg',
    'assets/images/bird1.jpg',
    'assets/images/bird.jpg'
  ];

  currentImage = this.images[0];

  auctionTime = '12 hours 51 minutes';

  changeImage(image: string) {
    this.currentImage = image;
  }


  bidNow() {
    alert('Bid placed successfully!');
  }
}
