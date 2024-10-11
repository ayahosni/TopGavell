import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  selectedFile: File | null = null;
  user: any = {}; 
  message: string = '';
  error: string = '';
  isEditing: boolean = false;
  userProfileImage: string = 'assets/images/user.jpeg'; 
  profileImageUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
      profile_picture: [null, Validators.pattern(/.(jpg|jpeg|png|gif)$/i)]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

 
  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.user = response?.user || {};
        this.profileImageUrl = this.user.profile_picture ? 
          `${this.userService.apiUrl}/public/uploads/${this.user.profile_picture}` : this.userProfileImage;
        this.profileForm.patchValue({
          name: this.user.name || '',
          email: this.user.email || '',
          phone_number: this.user.phone_number || '',
          address: this.user.address || ''
        });
      },
      error: (err) => {
        this.error = err;
      }
    });
  }


  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImageUrl = reader.result; 
      };
      reader.readAsDataURL(file);
    }
  }

  
   
  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }
  
    const formData = new FormData();
    formData.append('name', this.profileForm.get('name')?.value);
    formData.append('email', this.profileForm.get('email')?.value);
    formData.append('phone_number', this.profileForm.get('phone_number')?.value);
    formData.append('address', this.profileForm.get('address')?.value);
  
    if (this.selectedFile) {
      formData.append('profile_picture', this.selectedFile);
      
      this.userService.updateUserProfileWithImage(formData).subscribe({
        next: (response) => {
          this.message = response.message;
          
          this.profileImageUrl = response.profile_image_url || this.userProfileImage; 
          
          this.loadUserProfile(); 
  
          this.isEditing = false;
        },
        error: (err) => {
          this.error = err;
        }
      });
    } else {
      const data = {
        name: this.profileForm.get('name')?.value,
        email: this.profileForm.get('email')?.value,
        phone_number: this.profileForm.get('phone_number')?.value,
        address: this.profileForm.get('address')?.value
      };
  
      this.userService.updateUserProfile(data).subscribe({
        next: (response) => {
          this.message = response.message;
          
          this.loadUserProfile(); 
  
          this.isEditing = false;
        },
        error: (err) => {
          this.error = err;
        }
      });
    }
  }
  

  
  enableEditing(): void {
    this.isEditing = true;
  }

 
  cancelEdit(): void {
    this.isEditing = false;
    this.loadUserProfile();
  }


  changePicture(): void {
    const fileInput = document.getElementById('profile_picture_input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
