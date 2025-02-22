import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { DocumentComponent } from '../document/document.component';
import { UploadDocumentsComponent } from '../upload-documents/upload-documents.component';
import { DocumentService } from '../../../service/document.service';

@Component({
  selector: 'app-document-details',
  imports: [RouterOutlet, DocumentComponent, UploadDocumentsComponent],
  templateUrl: './document-details.component.html',
  styleUrl: './document-details.component.css',
})
export class DocumentDetailsComponent implements OnInit {
  receivedDocuments: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private documentService: DocumentService
  ) {
    // Option 1: Get state during navigation (preferred for initial load)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.receivedDocuments = navigation.extras.state['documents'];
    }

    // Option 2: Fallback to history.state if navigation is null (e.g., page refresh)
    if (!this.receivedDocuments && history.state.documents) {
      this.receivedDocuments = history.state.documents;
    }

    console.log('Received Documents:', this.receivedDocuments);
  }
  ngOnInit() {
    this.getDocuments(); 
  }


  getDocuments() {
    console.log('Folder ID:', this.receivedDocuments.folderId);
    
    this.documentService.getDocuments(this.receivedDocuments.folderId).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }


  searchDocument() {}
  openUploadModal() {
    this.router.navigate(['/documents/upload/',this.receivedDocuments.folderId]);
  }
}
