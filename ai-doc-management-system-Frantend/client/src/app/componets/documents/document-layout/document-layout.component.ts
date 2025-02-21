import { Component, OnInit } from '@angular/core';
import { DocumentDetailsComponent } from "../document-details/document-details.component";
import { UserNavbarComponent } from "../../user-navbar/user-navbar.component";
import { Router, RouterModule } from '@angular/router';
import { UploadDocumentsComponent } from "../upload-documents/upload-documents.component";

@Component({
  selector: 'app-document-layout',
  imports: [DocumentDetailsComponent, UserNavbarComponent, RouterModule, UploadDocumentsComponent],
  templateUrl: './document-layout.component.html',
  styleUrl: './document-layout.component.css'
})
export class DocumentLayoutComponent implements OnInit {
  constructor(private router:Router){}
  ngOnInit(): void {
  }
  searchDocument(){}
}
