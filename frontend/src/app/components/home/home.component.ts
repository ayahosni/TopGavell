import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuctionService, Auction, PaginatedAuctions } from '../../services/auction.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe'; 

interface Category {
  name: string;
  image: string;
}

interface TopAuction {
  image: string;
  name: string;
  winnerImage: string;
  winnerName: string;
  price: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule, SafeUrlPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  auctions: Auction[] = [];
  filteredAuctions: Auction[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  perPage: number = 10;

  categories: Category[] = [
    { name: 'Furniture', image: 'assets/images/furniture.jpg' },
    { name: 'Home Decor', image: 'assets/images/decor.jpg' },
    { name: 'Fine Art', image: 'assets/images/art.jpg' },
    { name: 'Birds', image: 'assets/images/bird.jpg' },
    { name: 'Animals', image: 'assets/images/animal.jpg' },
    { name: 'Motor Vehicles', image: 'assets/images/vehicles.jpg' }
  ];

  topAuctions: TopAuction[] = [
    {
      image: 'https://i.pinimg.com/564x/85/0a/ca/850aca7cd77c110e99ab20862aef14cf.jpg',
      name: 'Luxury Car Auction',
      winnerImage: 'https://i.pinimg.com/474x/3d/2e/ae/3d2eae4e497f028babdada44978fe851.jpg',
      winnerName: 'John Doe',
      price: 54345.08
    },
    {
      image: 'https://i.pinimg.com/564x/d4/2e/a0/d42ea0c760d91a64ab632a2bb950992f.jpg',
      name: 'Antique Painting Auction',
      winnerImage: 'https://i.pinimg.com/564x/06/22/e8/0622e80b0b75c6cfb005ecf2a18c02b6.jpg',
      winnerName: 'Mary Gard',
      price: 4135.08
    }
  ];

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadApprovedAuctions(this.currentPage);
  }

  /**
   * 
   * @param page 
   */
  loadApprovedAuctions(page: number = 1): void {
    this.auctionService.getApprovedAuctions(page, this.perPage).subscribe({
        next: (response: PaginatedAuctions) => {
            this.auctions = response.data;
            this.filteredAuctions = [...this.auctions]; 
            this.currentPage = response.meta.current_page;
            this.totalPages = response.meta.last_page;
            console.log('Loaded Approved Auctions:', this.auctions);
        },
        error: (err) => {
            console.error('Error loading approved auctions:', err);
        }
    });
}


  /**
   * @param auctionEndTime 
   * @returns 
   */
  checkAuctionStatus(auctionEndTime: string): string {
    const currentTime = new Date();
    const auctionEndDate = new Date(auctionEndTime);
    return auctionEndDate < currentTime ? 'closed' : 'opened';
  }

  /**
   * @param page 
   */
  fetchAuctions(page: number = 1): void {
    this.currentPage = page;
    this.auctionService.getApprovedAuctions(page, this.perPage).subscribe({
      next: (response: PaginatedAuctions) => {
        this.auctions = response.data;
        this.filteredAuctions = [...this.auctions];
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
      },
      error: (err) => {
        console.error('Error fetching auctions:', err);
      }
    });
  }

  /**
   */
  filterAuctions(): void {
    if (!this.searchTerm.trim()) {
      this.loadApprovedAuctions(this.currentPage);
      return;
    }

    this.auctionService.searchAuctions(this.searchTerm, this.currentPage, this.perPage).subscribe({
      next: (response: PaginatedAuctions) => {
        this.filteredAuctions = response.data;
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
        console.log('Filtered Auctions:', this.filteredAuctions);
      },
      error: (err) => {
        console.error('Error searching auctions:', err);
      }
    });
  }

  /**
   * @param page 
   */
  onPageChange(page: number): void {
    this.fetchAuctions(page);
  }

  /**
   */
  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.loadApprovedAuctions();
      return;
    }
    this.filterAuctions();
  }

  /**
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  /**
   */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }
  goToAuctionDetails(auctionId: string): void {
    this.router.navigate(['/auction', auctionId]);
  }
  
}
