import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import * as XLSX from 'xlsx';
import { SanitizeHtmlPipe } from "../../../pipe/sanitize-html.pipe";
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-document',
  imports: [NgxDocViewerModule, CommonModule, SanitizeHtmlPipe],
  templateUrl: './view-document.component.html',
  styleUrl: './view-document.component.css'
})
export class ViewDocumentComponent {

  selectedDoc: { url: string; viewer: string; type: string } | null = null;
  safeUrl: SafeResourceUrl | null = null;
  excelData: string | null = null;

  constructor(private sanitizer: DomSanitizer, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const { url, type } = navigation.extras.state;
      this.selectedDoc = {
        url,
        viewer: this.getViewerType(type),
        type
      };
      this.updateViewer();
    }
  }

  ngOnInit(): void {
    if (!this.selectedDoc) {
      console.error('No document data provided');
    }
  }

  private getViewerType(fileType: string): string {
    switch (fileType) {
      case 'application/pdf': return 'pdf';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword': return 'mammoth';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel': return 'custom';
      default: return 'pdf'; // Fallback
    }
  }

  private updateViewer(): void {
    if (!this.selectedDoc) return;
    this.safeUrl = null;
    this.excelData = null;

    if (this.selectedDoc.viewer === 'pdf') {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedDoc.url);
    } else if (this.selectedDoc.viewer === 'custom') {
      this.loadExcelFile(this.selectedDoc.url);
    }
    // 'mammoth' viewer uses ngx-doc-viewer directly
  }

  private loadExcelFile(url: string): void {
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        this.excelData = XLSX.utils.sheet_to_html(worksheet);
      })
      .catch(error => {
        console.error('Error loading Excel file:', error);
        this.excelData = '<p>Error loading Excel file.</p>';
      });
  }

  
}
