import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get userName() {
    return this.loginForm.get('userName');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    
  }

  onSubmit() {
    console.log('loginForm', this.loginForm.value);

    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).subscribe(
        (data) => {
          console.log(data);
          
          this.authService.storeTokenDetails(data);
          alert('Login success');
          this.router.navigate(['/user-dashboard']);
        },
        (error) => {
          console.log(error);
          alert('Invalid credentials');
        }
      );
    }
  }
}
