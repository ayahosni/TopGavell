import { Component, OnInit } from '@angular/core';
import { NotificationService, PaginatedNotifications } from '../../services/notification.service';
import { RouterModule, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Notification {
  id: string;
  data: {
    auction: string; 
    auction_id: string;  
    user: string;       
    content: string;  
  };
  created_at: string;  
}

// interface PaginatedNotifications {
//   current_page: number;
//   data: Notification[]; 
//   last_page: number;
//   total: number;
// }

@Component({
  standalone: true,
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
})
export class NotificationComponent implements OnInit {
  notifications: any;
  currentPage: any;
  totalPages: any;
  perPage: number = 5;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getNotifications()
  }

  getNotifications(page: number = 1) {
    this.notificationService.getNotifications(page, this.perPage).subscribe({
      next: (response : PaginatedNotifications) => {
        this.notifications = response.data;
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
        console.log(this.notifications);
      },
      error:(error) => {
        console.error('Error fetching notifications:', error);
      }
    });
  }
  /**
* @param page 
*/
  fetchNotifications(page: number = 1): void {
    this.currentPage = page;
    this.notificationService.getNotifications(page, this.perPage).subscribe({
      next: (response: PaginatedNotifications) => {
        this.notifications = response.data;
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
      },
      error: (err) => {
        console.error('Error fetching auctions:', err);
      }
  });
  }

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

  /**
 * @param page 
 */
  onPageChange(page: number): void {
    this.fetchNotifications(page);
  }
  
}
