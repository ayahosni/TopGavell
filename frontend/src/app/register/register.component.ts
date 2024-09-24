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
    console.log(this.registerForm.value.password)
    console.log(this.registerForm.value.password_confirmation)

    if (this.registerForm.invalid) {
      return;
    }

    if (this.registerForm.value.password != this.registerForm.value.password_confirmation) {
      alert('Passwords do not match');
      return;
    }
    
    this.authService.register(this.registerForm.value).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        if (error.error.password) {
          console.log('Error:', error.error);
        }
      }
    })
  }
}