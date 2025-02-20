import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent,NgIcon,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
