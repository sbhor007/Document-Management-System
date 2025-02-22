import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DocumentComponent } from "../document/document.component";
import { UploadDocumentsComponent } from "../upload-documents/upload-documents.component";

@Component({
  selector: 'app-document-details',
  imports: [RouterOutlet, DocumentComponent, UploadDocumentsComponent],
  templateUrl: './document-details.component.html',
  styleUrl: './document-details.component.css'
})
export class DocumentDetailsComponent {
  
  constructor(private router:Router){}
  
  searchDocument(){}
  openUploadModal(){
    this.router.navigate(['/documents/upload']);
  }
}
