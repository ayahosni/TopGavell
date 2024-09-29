import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-verfication',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-verfication.component.html',
  styleUrl: './email-verfication.component.css'
})
export class EmailVerficationComponent implements OnInit {
  token: string | null = null;
  verificationStatus: string = '';
  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const hash = params['hash'];

      // Call the verifyEmail method
      this.authService.verifyEmail(id, hash).subscribe({
        next: (response) => {
          console.log('Verification successful:', response);
          // Handle success (e.g., show a success message)
        },
        error: (error) => {
          console.error('Verification failed:', error.error);
          // Handle error (e.g., show an error message)
        }
    });
    });

    // console.log(this.isEmailVerfied);
    // const userJson = localStorage.getItem('user');
    // if (userJson) {
    //   const user = JSON.parse(userJson);
    //   if(user.email_verified_at){
    //     this.isEmailVerfied=true;
    //   }        
    // } else {
    //   console.log('No user data found in localStorage.');
    // }
    // console.log(this.isEmailVerfied);
  }

  
    // verifyEmail(token: string): void {
    //   this.authService.verifyEmail(token).subscribe({
    //     next: (response) => {
    //       console.log('Verification successful:', response);
    //       this.verificationStatus = 'Email verified successfully!';
    //     },
    //     error: (error) => {
    //       console.error('Verification failed:', error);
    //       this.verificationStatus = 'Failed to verify email. Please try again later.';
    //     }
    //   });
    // }
  }

