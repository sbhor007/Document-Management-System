import { Component } from '@angular/core';
import { OtpComponent } from "../otp/otp.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [OtpComponent,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

}
