import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  message: any;
  loginForm: FormGroup;
  errorMessage: string = ''; 

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


// onSubmit() {
//   this.authService.logIn(this.loginForm.value).subscribe({
//     next: (response) => {
//       this.router.navigate(['/']);
//     },
//     error: (error) => {
//       this.message = error.error;
//     }
//   });
// }
// }
onSubmit() {
  this.authService.logIn(this.loginForm.value).subscribe({
    next: (response: any) => {
      const token = response.token;
      
      if (token) {
        
        localStorage.setItem('authToken', token);
        console.log('Token stored:', token);

        
        this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Login failed. No token received.';
      }
    },
    error: (error) => {
      this.message = error.error;
      this.errorMessage = 'Invalid login credentials. Please try again.';
    }
  });
}
}