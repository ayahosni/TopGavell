import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';  
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink,FormsModule],
  providers: [AuthService], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {
  loginForm: any; 
  email: string = '';
  password: string = '';

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/']); 
        },
        error: (error) => {
          console.error('Login failed', error);
          alert('Invalid email or password');
        }
      });
    } else {
      console.log('Invalid form submission');
      alert('Please fill in all fields correctly.');
    }
  }
}
