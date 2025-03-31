import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, NgIcon, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    console.log(this.authService.isLoggedIn());
    if (this.authService.isLoggedIn()) {
      localStorage.getItem('roll') === 'ADMIN'
        ? this.router.navigate(['/admin-dashboard'])
        : this.router.navigate(['/user-dashboard']);
    }
  }
}
