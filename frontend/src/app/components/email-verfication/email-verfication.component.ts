import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-verfication',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-verfication.component.html',
  styleUrl: './email-verfication.component.css'
})
export class EmailVerficationComponent implements OnInit {
  email: string = '';
  otp: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.email = user.email
    }
  }

  constructor(private http: HttpClient,private router: Router) {}

  verify() {
    this.http.post('http://localhost:8000/api/email_verify', { email: this.email, otp: this.otp }).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
        this.successMessage = 'Email verified successfully.';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Invalid OTP. Please try again.';
        this.successMessage = '';
      }
    });
  }
}

