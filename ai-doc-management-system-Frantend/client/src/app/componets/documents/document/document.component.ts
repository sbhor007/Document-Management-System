import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../../service/document.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document',
  imports: [CommonModule],
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent implements OnInit {

  @Input() document: any;
  @Output() documentDeleted = new EventEmitter<void>();

  constructor(private router: Router, private documentService: DocumentService) {}

  ngOnInit(): void {
    console.log("Document:", this.document);
    
    console.log('tttttt : ',this.documentService.openedDocument);
  }

  // Navigate to viewer instead of downloading
  viewDocument(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/documents/view-document'], {
      state: { document: this.document }
    });
  }

  downloadDocument(event: Event) {
    event.stopPropagation();
    this.documentService.downloadDocument(this.document.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.document.documentName || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading document:', error);
        alert('Failed to download document');
      }
    });
  }

  renameDocument(event: Event) {
    event.stopPropagation();
    const newName = prompt('Enter new name for document:', this.document.documentName);
    if (newName && newName.trim() !== '') {
      console.log('Rename document to:', newName);
      alert('Rename functionality not implemented yet');
    }
  }

  deleteDocument(event: Event) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${this.document.documentName}"?`)) {
      this.documentService.deleteDocument(this.document.id).subscribe({
        next: () => {
          this.documentDeleted.emit();
        },
        error: (error) => {
          console.error('Error deleting document:', error);
          alert('Failed to delete document');
        }
      });
    }
  }

  openDocument() {
    this.viewDocument(new Event('click')); // Trigger view on card click
    this.documentService.addOpenedDocument(this.document)
    
  }

  get openedDocuments(): any[] {
    
    return this.documentService.openedDocument;
  }

  getDocumentColorClass(): string {
    const fileType = this.document?.fileType?.toLowerCase() || '';
    if (fileType.includes('pdf')) return 'bg-red-100';
    if (fileType.includes('word') || fileType.includes('document')) return 'bg-blue-100';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'bg-green-100';
    if (fileType.includes('image')) return 'bg-purple-100';
    return 'bg-gray-100';
  }

  getDocumentIcon(): string {
    const fileType = this.document?.fileType?.toLowerCase() || '';
    if (fileType.includes('pdf')) return 'assets/icons/pdf-icon.png';
    if (fileType.includes('word') || fileType.includes('document')) return 'assets/icons/word-icon.png';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'assets/icons/excel-icon.png';
    if (fileType.includes('image')) return 'assets/icons/image-icon.png';
    return 'assets/icons/file-icon.png';
  }
}
