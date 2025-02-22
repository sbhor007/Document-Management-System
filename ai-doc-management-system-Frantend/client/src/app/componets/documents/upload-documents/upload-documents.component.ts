import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DocumentService } from '../../../service/document.service';

@Component({
  selector: 'app-upload-documents',
  imports: [CommonModule],
  templateUrl: './upload-documents.component.html',
  styleUrl: './upload-documents.component.css'

})
export class UploadDocumentsComponent {
    uploadedFiles: File[] = [];

    constructor(private documentService: DocumentService) { }

    onFileSelected(event: any) {
      const files: FileList = event.target.files;
      for (let i = 0; i < files.length; i++) {
        if(files[i].type == 'application/pdf') {
          // alert('Only PDF files are allowed');
          this.uploadedFiles.push(files[i]);
        }
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
      const folderId = 1; // Replace with dynamic folder ID
      this.documentService.uploadDocuments(this.uploadedFiles, folderId).subscribe({
        next: response => console.log('Upload success', response),
        error: err => console.error('Upload error', err)
      });
    }
    
}
