import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  auctions: any[] = [];
  filteredAuctions: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  perPage: number = 10;
  images: string[] = [];
  
  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAuctions(this.currentPage);
  }

  loadAuctions(page: number = 1) {
    this.auctionService.getAuctions(page, this.perPage).subscribe({
      next: (response: any) => {
        this.auctions = response.data;
        this.filteredAuctions = [...this.auctions]; // تهيئة filteredAuctions
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
        console.log('Auctions:', this.auctions);
      },
      error: (err) => {
        console.error('Error loading auctions:', err);
      }
    });
  }

  checkAuctionStatus(auctionEndTime: string): string {
    const currentTime = new Date();
    const auctionEndDate = new Date(auctionEndTime);
    return auctionEndDate < currentTime ? 'closed' : 'opened';
  }
  
  filterAuctions(): void {
    if (!this.searchTerm) {
      this.loadAuctions(this.currentPage);
      return;
    }

    this.auctionService.searchAuctions(this.searchTerm, this.currentPage, this.perPage).subscribe({
      next: (response: any) => {
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

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    if (this.searchTerm) {
      this.filterAuctions();
    } else {
      this.loadAuctions(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }
}
