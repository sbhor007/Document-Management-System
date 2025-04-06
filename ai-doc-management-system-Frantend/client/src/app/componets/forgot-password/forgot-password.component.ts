import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OtpComponent } from "../otp/otp.component";
import { Router } from '@angular/router';
import { EmailServiceService } from '../../service/email-service.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { PasswordInputComponent } from "../password-input/password-input.component";

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    OtpComponent,
    CommonModule,
    PasswordInputComponent
],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  showOtpModal = false;
  showInputPasswordModel = false
  registeredEmail: string = '';
  submitted = false;
  loading = false;
  enteredEmail = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router:Router,
    private emailServices:EmailServiceService,
    private authService:AuthService

  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.forgotPasswordForm.invalid) {
      alert("invalid")
      return;
    }

    this.loading = true;
    this.enteredEmail = this.forgotPasswordForm.value.email;

    this.emailServices.checkEmailExists(this.f['email'].value).subscribe({
      next: (response) => {
        console.log('Email check response:', response);
        if (response.data === true) {
          this.loading = false;
          alert('Otp Send Successfully')
          // console.log('Otp Send Successfully');
          this.sendOtp(this.enteredEmail);
          setTimeout(() => {
            this.loading = false;
            this.showOtpModal = true;
          }, 2000);
          
        } else {
          this.loading = false;
          this.errorMessage = `${this.f['email'].value} : Not Found`;

        }
      },
      error: (error) => {
        // console.error('Error checking email:', error);
        this.loading = false;
        // this.errorMessage = error.error?.message || 'Error checking email. Please try again.';
        this.errorMessage = 'Error checking email. Please try again.';
      }
    })

    
  }
  private sendOtp(email: string) {
    // console.log('Sending OTP to:', email);
    this.emailServices.sendOtp(email).subscribe({
      next: (response) => {
        if(response){
          console.log('OTP sent successfully');
        this.loading = false;
        this.showOtpModal = true;
        }
        
      },
      error: (error) => {
        // console.error('Failed to send OTP:', error);
        this.loading = false;
        // this.errorMessage = error.message || 'Failed to send OTP. Please try again.';
        this.errorMessage = 'Failed to send OTP. Please try again.';
      }
    });
  }



  
  onOtpVerified() {
    // console.log('OTP verified');
    this.showOtpModal = false; 
    // console.log('showOtpModal:', this.showOtpModal); // Log to check if it is false
    this.showInputPasswordModel = true;
    // console.log('showInputPasswordModel:', this.showInputPasswordModel); // Log to check if it is true
    alert("OTP Verified. You can now set a new password.");
  }
  
  

  onPasswordChanged(){
    // console.log('Password Changed');
    this.loading = true;
    this.showInputPasswordModel = false
    alert("Password changed")
    this.router.navigate(['/home/login']);
  }
}
