import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userData: any;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getAllData().subscribe({
        next: (data) => {
          this.userData = data; 
        },
        error: (err) => {
          console.error('Error loading user data:', err);
        }
      });
    }
  }
}
