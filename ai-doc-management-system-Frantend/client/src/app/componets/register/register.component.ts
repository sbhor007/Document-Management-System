import { Component } from '@angular/core';
import { OtpComponent } from "../otp/otp.component";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../service/auth.service';
import { EmailServiceService } from '../../service/email-service.service';
import { response } from 'express';
import { subscribe } from 'diagnostics_channel';
import { verify } from 'crypto';

@Component({
  selector: 'app-register',
  imports: [OtpComponent, RouterLink,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string | null = null;
  showOtpModal = false;
  registeredEmail: string = '';
  registerData: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private emailService: EmailServiceService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    console.log('Form submitted:', this.registerForm.value);

    if (this.registerForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    this.loading = true;
    this.registerData = {
      name: this.f['name'].value,
      userName: this.f['userName'].value,
      password: this.f['password'].value
    };
    this.registeredEmail = this.registerData.userName;

    console.log('Register data:', this.registerData);

    this.authService.checkEmailExists(this.registeredEmail).subscribe({
      next: (response) => {
        console.log('Email check response:', response);
        if (response.data === true) {
          this.loading = false;
          this.errorMessage = 'Email already exists. Please use a different email.';
        } else {
          console.log('Email does not exist');
          this.sendOtp(this.registeredEmail);
        }
      },
      error: (error) => {
        console.error('Error checking email:', error);
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error checking email. Please try again.';
      }
    });
  }

  private sendOtp(email: string) {
    console.log('Sending OTP to:', email);
    this.emailService.sendOtp(email).subscribe({
      next: () => {
        console.log('OTP sent successfully');
        this.loading = false;
        this.showOtpModal = true;
      },
      error: (error) => {
        console.error('Failed to send OTP:', error);
        this.loading = false;
        this.errorMessage = error.message || 'Failed to send OTP. Please try again.';
      }
    });
  }

  onOtpVerified() {
    console.log('OTP verified');
    this.loading = true;
    this.showOtpModal = false;

    this.authService.registerUser(this.registerData).subscribe({
      next: (response) => {
        console.log('User registered successfully:', response);
        this.loading = false;
        this.errorMessage = 'Registration successful!';
        setTimeout(() => {
          this.router.navigate(['/home/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.loading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}