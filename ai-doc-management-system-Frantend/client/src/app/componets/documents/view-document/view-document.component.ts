import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@Component({
  selector: 'app-view-document',
  imports: [NgxDocViewerModule,CommonModule],
  templateUrl: './view-document.component.html',
  styleUrl: './view-document.component.css'
})
export class ViewDocumentComponent {
  documents: { url: string; viewer: string; type: string }[] = [
    { url: '/assets/documents/SantoshBhorResume.pdf', viewer: 'pdf', type: 'PDF' },
    { url: '/assets/documents/sample.docx', viewer: 'mammoth', type: 'Word' },
    { url: '/assets/documents/sample.xlsx', viewer: 'custom', type: 'Excel' }
  ];

  selectedDoc = this.documents[0];
  safeUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {
    this.updateSafeUrl(this.selectedDoc);
  }

  onDocChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const index = Number(selectElement.value);
    this.selectedDoc = this.documents[index];
    this.updateSafeUrl(this.selectedDoc);
  }

  private updateSafeUrl(doc: { url: string; viewer: string; type: string }): void {
    if (doc.viewer === 'pdf') {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(doc.url);
    } else {
      this.safeUrl = null;
    }
  }  
}
