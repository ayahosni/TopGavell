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
  loginForm: FormGroup;
  errorMessage: string = ''; 

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


onSubmit() {
  console.log(this.loginForm.value);

  if (this.loginForm.invalid) {
    console.log('Invalid form');
    return;
  }

  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      console.log('Login successful', response);

      const userData = {
        token: response.token,
        email: this.loginForm.value.email,
        name: response.user.name,  
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
