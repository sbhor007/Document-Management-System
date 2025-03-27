import { Component, NgModule } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FolderService } from '../../service/folder.service';
import { CreateFolderComponent } from "../folders/create-folder/create-folder.component";
import { FolderComponent } from "../folders/folder/folder.component";
import { CommonModule } from '@angular/common';
import { AcceptFolderDetailsComponent } from "../folders/accept-folder-details/accept-folder-details.component";

@Component({
  selector: 'app-user-dashboard',
  imports: [CreateFolderComponent, FolderComponent, CommonModule, AcceptFolderDetailsComponent,RouterOutlet],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {

  folders:any

  constructor(private router:Router,private authService:AuthService,private folderService:FolderService) { }

  ngOnInit(){
    this.getAllFolders();
  }
  n:number = 4
  getAllFolders(){
    this.folderService.getAllFolders().subscribe((data: any[]) => {
      console.log(data);
      
      this.folders = data;
    }, (error: any) => {
      console.log(error);
    });
  }
  onFolderCreated(){
    this.getAllFolders();
  }

  onFolderDeleted(){
    this.getAllFolders()
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/home']);
    }
}
