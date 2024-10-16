import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  message: any = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.authService.logIn(this.loginForm.value).subscribe({
      next: (response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('authToken', token);
          console.log('Token stored:', token);

          if (response.user.banned === 1) {
            alert('Your account is banned. You cannot perform some actions.');

            setTimeout(() => {
              this.router.navigate(['/']);
            }, 3000); 

          } else {
            this.router.navigate(['/']);
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'Invalid login credentials. Please try again.';
      }
    });
  }
}
