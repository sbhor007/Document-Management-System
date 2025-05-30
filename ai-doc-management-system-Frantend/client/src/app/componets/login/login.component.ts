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
// import { Notyf } from 'notyf';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  // private notyf = new Notyf();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
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
    // this.notyf.success('Login successful!');
  }

  onSubmit() {
    
    // if(this.roll?.value) {
    //   this.loginForm.get('roll')?.setValue("ADMIN");
    // }else{
    //   this.loginForm.get('roll')?.setValue("USER");
    // }
    let userData = {};
    if(this.roll?.value) {
      userData ={
        userName: this.userName?.value,
        password: this.password?.value,
        roll: "ADMIN",
      }
    }
    else{
      userData ={
        userName: this.userName?.value,
        password: this.password?.value,
        roll: "USER",
      }
    }
    
    // console.log(this.roll?.value,"is Admin");
    // console.log('loginForm', this.loginForm.value);
    console.log(userData, "userData");
    

    if (this.loginForm.valid) {
      this.authService.loginUser(userData).subscribe(
        (response) => {
          // console.log(response);
          
          this.authService.storeTokenDetails(response);
          alert('Login success');

          if(response.data.roll === 'USER') {
            // console.log("navigate to user");
            
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
