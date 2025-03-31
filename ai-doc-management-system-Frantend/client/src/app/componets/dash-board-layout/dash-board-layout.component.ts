import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router, RouterModule } from '@angular/router';
import { UserDashboardComponent } from "../user-dashboard/user-dashboard.component";
import { UserNavbarComponent } from "../user-navbar/user-navbar.component";
import { AcceptFolderDetailsComponent } from "../folders/accept-folder-details/accept-folder-details.component";
import { UsersService } from '../../service/users.service';
import { error } from 'console';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../service/document.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-dash-board-layout',
  imports: [NavbarComponent, RouterModule, UserDashboardComponent, UserNavbarComponent, AcceptFolderDetailsComponent,FormsModule,CommonModule],
  templateUrl: './dash-board-layout.component.html',
  styleUrl: './dash-board-layout.component.css'
})
export class DashBoardLayoutComponent {
  user: any;
  documents: any[] = [];
  filteredDocuments: any[] = [];
  searchTerm: string = '';
  showDocuments: boolean = false; // New flag to control document list visibility

  constructor(
    private userService: UsersService,
    private documentService: DocumentService,
    private router: Router,
    private authService:AuthService
  ) {
    this.loadUserData();
  }

  ngOnInit(): void {
    
    // if(!this.authService.isLoggedIn())
    // {
    //   this.router.navigate(['/home'])
    //   return
    // }
    this.loadDocuments();
    // console.log("user data : "+this.user);
    // console.log("user data : "+ this.userService.userData);
    
  }

  loadUserData(): void {
    this.userService.getUser().subscribe({
      next: (data: any) => {
        this.user = data.data;
        this.userService.userData = this.user;
        console.log('User Data:', this.user);
      },
      error: (error) => {
        console.error("Error fetching user", error);
      }
    });
  }

  loadDocuments(): void {
    this.documentService.getAllDocuments().subscribe({
      next: (documents: any) => {
        this.documents = documents;
        this.filteredDocuments = []; // Initially empty, since searchTerm is empty
        console.log('All Documents:', this.documents);
      },
      error: (error) => {
        console.error("Error fetching documents", error);
      }
    });
  }

  searchDocument(): void {
    const query = this.searchTerm.trim().toLowerCase();

    if (!query) {
      // If search term is empty, hide the document list
      this.showDocuments = false;
      this.filteredDocuments = [];
      return;
    }

    // Show the document list and filter documents
    this.showDocuments = true;
    this.filteredDocuments = this.documents.filter(doc =>
      doc.documentName?.toLowerCase().includes(query) ||
      doc.fileType?.toLowerCase().includes(query)
    );
    console.log('Filtered Documents:', this.filteredDocuments);
  }

  viewDocument(doc: any): void {
    this.documentService.addOpenedDocument(doc);
    this.router.navigate(['/documents/view-document'], { 
      state: { document: doc } 
    });
  }
}
