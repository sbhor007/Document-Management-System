import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../../service/document.service';

@Component({
  selector: 'app-document',
  imports: [],
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent implements OnInit {

  @Input() document:any;

  constructor(private router:Router,private documentService:DocumentService) { }

  ngOnInit(): void {    
      console.log("Documents",this.document);
      
  }

  openDocument() {
    this.documentService.getPreSignedUrl(this.document.id).subscribe(
      (response) => {
        const preSignedUrl = response.data; // Extract URL from ApiResponse
        this.router.navigate(['/documents/view-document'], { state: { url: preSignedUrl, type: this.document.fileType } });
      },
      (error) => {
        console.error('Error fetching pre-signed URL:', error);
        alert('Failed to open document');
      }
    );
  }
}
