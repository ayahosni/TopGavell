import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Notification {
  id: string;
  data: {
    auction: string;  // اسم المزاد
    user: string;       // اسم المستخدم الذي قام بالتعليق
    content: string;    // محتوى التعليق أو الإشعار
  };
  created_at: string;   // تاريخ الإشعار
}

interface PaginatedNotifications {
  current_page: number;
  data: Notification[]; 
  last_page: number;
  total: number;
}

@Component({
  standalone: true,
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(private notificationService: NotificationService, private router: Router) {}

  ngOnInit(): void {
    this.loadNotifications(this.currentPage);
  }

  loadNotifications(page: number): void {
    this.notificationService.getNotifications(page).subscribe({
      next: (response: any) => {
        console.log(response); 
        this.notifications = response.data; 
        this.currentPage = response.current_page;
        this.totalPages = response.last_page;
      },
      error: (error) => {
        console.error('Error fetching notifications:', error);
        this.errorMessage = 'Failed to load notifications. Please try again later.';
      }
    });
  }

  goToAuctionDetails(auctionId: string): void {
    this.router.navigate(['/auction', auctionId]); // التنقل باستخدام auctionId
  }
}
