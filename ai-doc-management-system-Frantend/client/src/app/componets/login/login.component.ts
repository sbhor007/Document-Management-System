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
      roll: [false],
    });
  }

  get userName() {
    return this.loginForm.get('userName');
  }

  get password() {
    return this.loginForm.get('password');
  }
  get roll() {
    return this.loginForm.get('roll');
  }
  ngOnInit() {
    
  }

  onSubmit() {
    if(this.roll?.value) {
      this.loginForm.get('roll')?.setValue("ADMIN");
    }else{
      this.loginForm.get('roll')?.setValue("USER");
    }
    console.log(this.roll?.value,"is Admin");
    console.log('loginForm', this.loginForm.value);
    

    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).subscribe(
        (response) => {
          console.log(response);
          
          this.authService.storeTokenDetails(response);
          alert('Login success');

          if(response.data.roll === 'USER') {
            this.router.navigate(['/user-dashboard']);
          }
          else{
            this.router.navigate(['/admin-dashboard']);
          }
          
        },
        (error) => {
          console.log(error);
          alert('Invalid credentials');
        }
      );
    }
  }
}
