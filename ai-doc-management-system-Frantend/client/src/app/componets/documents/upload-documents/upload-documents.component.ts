import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DocumentService } from '../../../service/document.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-upload-documents',
  imports: [CommonModule],
  templateUrl: './upload-documents.component.html',
  styleUrl: './upload-documents.component.css',
})
export class UploadDocumentsComponent {
  uploadedFiles: File[] = [];
  folderId: number | null = null;
  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router:Router
  ) {
    const folderPar = this.route.snapshot.paramMap.get('folderId');
    this.folderId = folderPar ? parseInt(folderPar) : null;
    console.log('Folder ID:', this.folderId);
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      // if(files[i].type == 'application/pdf') {
      // alert('Only PDF files are allowed');
      this.uploadedFiles.push(files[i]);
      // }
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const files = event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        this.uploadedFiles.push(files[i]);
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }

  uploadFiles() {
    if (this.uploadedFiles.length === 0 || !this.folderId) {
      console.error('No files or folderId provided');
      return;
    }
    this.documentService
      .uploadDocuments(this.uploadedFiles, this.folderId)
      .subscribe({
        next: (response) => {
          console.log('Upload success', response);
          this.uploadedFiles = [];
          this.router.navigate(['/documents', this.folderId]);
        },
        error: (err) => {
          console.error('Upload error', err);
        },
      });
  }
}
