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
    // console.log('Folder ID:', this.folderId);
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      if (this.isValidFile(files[i])) {
        this.uploadedFiles.push(files[i]);
      } else {
        alert(`File rejected: ${files[i].name} - Folders and .exe files are not allowed`)
        // console.warn(`File rejected: ${files[i].name} - Folders and .exe files are not allowed`);
      }
      // this.uploadedFiles.push(files[i]);
      // }
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const files = event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        if (this.isValidFile(files[i])) {
          this.uploadedFiles.push(files[i]);
        } else {
          alert(`File rejected: ${files[i].name} - Folders and .exe files are not allowed`)
          // console.warn(`File rejected: ${files[i].name} - Folders and .exe files are not allowed`);
        }
        // this.uploadedFiles.push(files[i]);
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
      // console.error('No files or folderId provided');
      return;
    }
    this.documentService
      .uploadDocuments(this.uploadedFiles, this.folderId)
      .subscribe({
        next: (response) => {
          // console.log('Upload success', response);
          this.uploadedFiles = [];
          alert('Files uploaded successfully!');
          // this.router.navigate(['/documents', this.folderId]);
         
        },
        error: (err) => {
          alert("Fail to upload documents")
          // console.error('Upload error', err);
        },
      });
  }
// TODO: For Checking if the file is valid or not
  private isValidFile(file: File): boolean {
    // Check if file has a name (folders typically don't have extensions)
    if (!file.name || file.name === '') {
      return false;
    }
    
    // Check if file size is 0 (could indicate a folder) and reject .exe files
    const isExecutable = file.name.toLowerCase().endsWith('.exe');
    const isEmpty = file.size === 0;
    
    return !isExecutable && !isEmpty;
  }
}
