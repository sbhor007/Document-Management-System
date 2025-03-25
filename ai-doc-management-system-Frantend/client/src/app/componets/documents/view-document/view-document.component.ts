import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import * as XLSX from 'xlsx';
import { SanitizeHtmlPipe } from '../../../pipe/sanitize-html.pipe';
import { Router } from '@angular/router';
import { DocumentService } from '../../../service/document.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer'; 

@Component({
  selector: 'app-view-document',
  imports: [NgxDocViewerModule, CommonModule, SanitizeHtmlPipe,NgxExtendedPdfViewerModule,],
  templateUrl: './view-document.component.html',
  styleUrl: './view-document.component.css',
})
export class ViewDocumentComponent implements OnInit,OnDestroy {
  selectedDoc: { url: string; viewer: string; type: string; document?: any; blob?: Blob } | null = null;
  safeUrl: SafeResourceUrl | null = null;
  excelData: string | null = null;
  loading: boolean = false;
  error: string | null = null;
  pdfLoadError: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    const state = history.state || this.router.getCurrentNavigation()?.extras.state;
    if (state?.document) {
      this.selectedDoc = {
        document: state.document,
        type: state.document.fileType,
        viewer: this.getViewerType(state.document.fileType),
        url: ''
      };
      this.loadDocument();
    } else {
      this.error = 'No document data provided';
    }
  }

  private loadDocument(): void {
    if (!this.selectedDoc?.document?.id) {
      this.error = 'Document ID not provided';
      return;
    }

    this.loading = true;
    this.documentService.downloadDocument(this.selectedDoc.document.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        this.selectedDoc = { ...this.selectedDoc!, url, blob };
        this.updateViewer();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching document:', error);
        this.error = 'Failed to load document';
        this.loading = false;
      }
    });
  }

  private getViewerType(fileType: string): string {
    switch (fileType) {
      case 'application/pdf': return 'pdf';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword': return 'mammoth';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel': return 'custom';
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif': return 'image';
      default: return 'pdf'; // Fallback
    }
  }

  getDocumentType(fileType: string): string {
    switch (fileType) {
      case 'application/pdf': return 'PDF Document';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword': return 'Word Document';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel': return 'Excel Spreadsheet';
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif': return 'Image';
      default: return 'Unknown';
    }
  }

  private updateViewer(): void {
    if (!this.selectedDoc) return;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedDoc.url);
    this.excelData = null;
    this.pdfLoadError = false;

    if (this.selectedDoc.viewer === 'custom' && this.selectedDoc.blob) {
      this.loadExcelFile(this.selectedDoc.blob);
    }
  }

  private loadExcelFile(blob: Blob): void {
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as ArrayBuffer;
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      this.excelData = XLSX.utils.sheet_to_html(worksheet);
    };
    reader.onerror = () => {
      this.excelData = '<p>Error loading Excel file.</p>';
    };
    reader.readAsArrayBuffer(blob);
  }

  downloadDocument() {
    if (this.selectedDoc?.url) {
      const link = document.createElement('a');
      link.href = this.selectedDoc.url;
      link.download = this.selectedDoc.document?.documentName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  goBack() {
    this.router.navigate(['/documents']);
  }

  onPdfLoadError(event: any) {
    this.pdfLoadError = true;
    this.error = 'Failed to load PDF with viewer. Using fallback.';
  }

  onPdfLoaded(event: any) {
    console.log('PDF loaded successfully');
  }

  onImageLoadError(event: any) {
    this.error = 'Failed to load image.';
  }

  ngOnDestroy(): void {
    if (this.selectedDoc?.url) {
      window.URL.revokeObjectURL(this.selectedDoc.url);
    }
  }
}
