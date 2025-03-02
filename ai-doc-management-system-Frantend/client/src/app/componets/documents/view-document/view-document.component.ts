import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import * as XLSX from 'xlsx';
import { SanitizeHtmlPipe } from "../../../pipe/sanitize-html.pipe";

@Component({
  selector: 'app-view-document',
  imports: [NgxDocViewerModule, CommonModule, SanitizeHtmlPipe],
  templateUrl: './view-document.component.html',
  styleUrl: './view-document.component.css'
})
export class ViewDocumentComponent {
  documents = [
    { url: '/assets/documents/SantoshBhorResume.pdf', viewer: 'pdf', type: 'PDF' },
    { url: '/assets/documents/sample.docx', viewer: 'mammoth', type: 'Word' },
    { url: '/assets/documents/sample.xlsx', viewer: 'custom', type: 'Excel' }
  ];

  selectedDoc = this.documents[0];
  safeUrl: SafeResourceUrl | null = null;
  excelData: string | null = null; // To store Excel HTML content

  constructor(private sanitizer: DomSanitizer) {
    this.updateViewer(this.selectedDoc);
  }

  onDocChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const index = Number(selectElement.value);
    this.selectedDoc = this.documents[index];
    this.updateViewer(this.selectedDoc);
  }

  private updateViewer(doc: { url: string; viewer: string; type: string }): void {
    this.safeUrl = null;
    this.excelData = null;

    if (doc.viewer === 'pdf') {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(doc.url);
    } else if (doc.viewer === 'custom') {
      this.loadExcelFile(doc.url);
    }
    // 'mammoth' viewer doesn't need additional handling here
  }

  private loadExcelFile(url: string): void {
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        this.excelData = XLSX.utils.sheet_to_html(worksheet); // Convert to HTML
      })
      .catch(error => {
        console.error('Error loading Excel file:', error);
        this.excelData = '<p>Error loading Excel file.</p>';
      });
  }


  downloadFile(url: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'default-filename';
    link.click();
  }
}
