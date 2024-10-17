import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  message: any = {};
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.loading = true;
    this.authService.logIn(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.loading = false;
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
        this.loading = false;
        this.message = error.error;
      }
    });
  }
}
