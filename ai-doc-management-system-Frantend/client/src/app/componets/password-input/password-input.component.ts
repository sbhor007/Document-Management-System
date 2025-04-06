import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-input',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.css'
})
export class PasswordInputComponent implements OnInit {
  passwordForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  @Input() email: string = '';
  @Output() passwordChanged = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  get f() {
    return this.passwordForm.controls;
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = "";
    
    const newPasswordData = {
      "email": this.email,
      "newPassword": this.f['newPassword'].value
    };

    this.authService.forgotPassword(newPasswordData).subscribe({
      next: (response) => {
        // console.log('Password updated successfully:', response);
        this.passwordChanged.emit(this.f['newPassword'].value);
        this.router.navigate(['/home/login']);
      },
      error: (error) => {
        // console.log("Failed to update password", error);
        this.errorMessage = error.error?.message || 'Failed to update password';
        this.loading = false;
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}