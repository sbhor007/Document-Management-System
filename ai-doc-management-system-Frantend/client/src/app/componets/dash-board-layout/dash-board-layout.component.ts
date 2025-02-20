import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterModule } from '@angular/router';
import { UserDashboardComponent } from "../user-dashboard/user-dashboard.component";
import { UserNavbarComponent } from "../user-navbar/user-navbar.component";
import { AcceptFolderDetailsComponent } from "../folders/accept-folder-details/accept-folder-details.component";

@Component({
  selector: 'app-dash-board-layout',
  imports: [NavbarComponent, RouterModule, UserDashboardComponent, UserNavbarComponent, AcceptFolderDetailsComponent],
  templateUrl: './dash-board-layout.component.html',
  styleUrl: './dash-board-layout.component.css'
})
export class DashBoardLayoutComponent {


  searchDocument(){}


}
