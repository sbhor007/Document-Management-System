import { Component,  OnInit } from '@angular/core';
import { ActivatedRoute, Router,  } from '@angular/router';
import { DocumentComponent } from '../document/document.component';
import { DocumentService } from '../../../service/document.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../service/users.service';

@Component({
  selector: 'app-document-details',
  imports: [ DocumentComponent, CommonModule,FormsModule],
  templateUrl: './document-details.component.html',
  styleUrl: './document-details.component.css',
})
export class DocumentDetailsComponent implements OnInit {
  receivedDocuments: any;
  documents: any;
  searchTerm: string = '';
  filteredDocuments: any[] = [];
  user:any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private userService: UsersService
  ) {
    // this.user = this.userService.userData;
    // console.log("user data : "+this.user);
    const navigation = this.router.getCurrentNavigation();
    this.receivedDocuments = navigation?.extras.state?.['documents'] || history.state.documents;
    // console.log('Received Documents:', this.receivedDocuments);
  }

  ngOnInit() {
    this.user = this.userService.userData;
    // console.log("user data : "+this.user);
    this.getDocuments();
  }

  getDocuments() {
    if (!this.receivedDocuments?.folderId) return;
    this.documentService.getDocuments(this.receivedDocuments.folderId).subscribe({
      next: (data: any) => {
        this.documents = data;
        this.filteredDocuments = data.data || [];
        this.user = this.documents.data[0].user.name
        // console.log('xxxx : ',this.user);
        // console.log("filter : " + this.filterDocuments);
        
        // console.log('Document Data:', this.documents);
      },
      error: (error) => {
        // console.error('Error fetching documents:', error);
      }
    });
  }
  filterDocuments() {
    if (!this.searchTerm.trim()) {
      this.filteredDocuments = this.documents?.data || [];
      return;
    }
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredDocuments = (this.documents?.data || []).filter((doc: any) =>
      doc.documentName.toLowerCase().includes(searchTermLower)
    );
  }

  openUploadModal() {
    this.router.navigate(['/documents/upload', this.receivedDocuments.folderId]);
  }

  onDocumentDeleted() {
    this.getDocuments();
  }
}

