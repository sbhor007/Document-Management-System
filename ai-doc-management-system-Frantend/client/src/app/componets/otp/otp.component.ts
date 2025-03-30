import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { EmailServiceService } from '../../service/email-service.service';

@Component({
  selector: 'app-otp',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent implements OnChanges {
  @Input() email: string = '';
  @Output() otpVerified = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  otp: string = '';
  isOtpValid: boolean = false;
  errorMessage: string = '';
  resendCooldown: number = 0;
  isVerifying: boolean = false;
  isResending: boolean = false;

  constructor(private emailService: EmailServiceService,private router:Router) {}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  validateOtp() {
    // Only allow numeric input
    this.otp = this.otp.replace(/[^0-9]/g, '');
    
    // OTP should be exactly 6 digits
    this.isOtpValid = this.otp.length === 6;
    
    // Clear any previous error messages
    this.errorMessage = '';
  }

  verifyOtp() {
    if (this.isOtpValid) {
      this.isVerifying = true;
      this.errorMessage = '';

      this.emailService.verifyOtp(this.email, this.otp).subscribe({
        next: () => {
          this.isVerifying = false;
          this.otpVerified.emit();
          alert("OPT verified")
          this.router.navigate(['/home/login'])

        },
        error: (error) => {
          this.isVerifying = false;
          this.errorMessage = error.message || 'OTP Verification failed';
          console.error('OTP Verification error', error);
        }
      });
    }
  }

  closeModal() {
    this.close.emit();
  }

  resendOtp() {
    // Reset cooldown to 60 seconds
    this.isResending = true;
    this.errorMessage = '';
    this.resendCooldown = 60;
    
    this.emailService.sendOtp(this.email).subscribe({
      next: () => {
        this.isResending = false;
        // Start cooldown timer
        const timer = setInterval(() => {
          this.resendCooldown--;
          if (this.resendCooldown <= 0) {
            clearInterval(timer);
          }
        }, 1000);
      },
      error: (error) => {
        this.isResending = false;
        this.errorMessage = error.message || 'Failed to resend OTP';
        this.resendCooldown = 0;
        console.error('Resend OTP error:', error);
      }
    });
  }
}