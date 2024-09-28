import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  providers: [AuthService], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup; 
  serverErrors: any = {};

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]], 
      address: ['', Validators.required], 
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    });
    
  }

  onSubmit() {
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      console.log('Invalid form');
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registration successful', response);

        const userData = {
          token: response.token,
          email: this.registerForm.value.email,
          name: this.registerForm.value.name 
        };
        localStorage.setItem('user', JSON.stringify(userData));

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log('Error:', error.error);
      }
    });
  }
}