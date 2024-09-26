import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    console.log(this.loginForm.value); 
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          const token = response.token;
          localStorage.setItem('token', token);
          console.log('login success');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    } else {
      alert('Please fill in all fields correctly.');
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log('Error:', error.error);
      }
    });
  }
}