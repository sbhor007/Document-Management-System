import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-documents',
  imports: [CommonModule],
  templateUrl: './upload-documents.component.html',
  styleUrl: './upload-documents.component.css'
})
export class UploadDocumentsComponent {
    uploadedFiles: File[] = [];

    onFileSelected(event: any) {
      const files: FileList = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.uploadedFiles.push(files[i]);
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
      console.log("Uploading files...", this.uploadedFiles);
      this.uploadedFiles = [];
      // Here you can integrate with AWS S3, Firebase, or any API for file storage.
    }
}
