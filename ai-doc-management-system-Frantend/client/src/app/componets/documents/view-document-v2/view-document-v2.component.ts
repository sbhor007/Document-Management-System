// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import {ActivatedRoute, Router } from '@angular/router';
// import * as XLSX from 'xlsx';
// import { SanitizeHtmlPipe } from '../../../pipe/sanitize-html.pipe';
// import { NgxDocViewerModule } from 'ngx-doc-viewer';

// @Component({
//   selector: 'app-view-document-v2',
//   imports: [CommonModule, SanitizeHtmlPipe,NgxDocViewerModule, CommonModule, SanitizeHtmlPipe],
//   templateUrl: './view-document-v2.component.html',
//   styleUrl: './view-document-v2.component.css'
// })
// export class ViewDocumentV2Component {
//   selectedDoc: { url: any; viewer: string; type: string } | null = null;
//   safeUrl: SafeResourceUrl | null = null;
//   googleViewerUrl: SafeResourceUrl | null = null;
//   excelData: string | null = null;
//   isLoading: boolean = true;
  
//   // Optional document info for the sidebar
//   documentInfo: {
//     name: string;
//     type: string;
//     size: string;
//     uploadDate: string;
//   } | null = null;

//   constructor(
//     private sanitizer: DomSanitizer, 
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     const navigation = this.router.getCurrentNavigation();
//     if (navigation?.extras.state) {
//       const { url, type } = navigation.extras.state;
//       this.selectedDoc = {
//         url,
//         viewer: this.getViewerType(type),
//         type,
//       };
//       console.log(this.selectedDoc,"Hii");
      
//       // Mock document info - in real app, you'd fetch this from your API
//       this.documentInfo = {
//         name: this.extractFileName(url) || 'Document',
//         type: this.formatFileType(type),
//         size: 'Unknown',
//         uploadDate: new Date().toLocaleDateString()
//       };
//     }
//   }

//   ngOnInit(): void {
//     if (!this.selectedDoc) {
//       console.error('No document data provided');
//       this.isLoading = false;
//     } else {
//       this.updateViewer();
//     }
//   }

//   private getViewerType(fileType: string): string {
//     switch (fileType) {
//       case 'application/pdf':
//         return 'pdf';
//       case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
//       case 'application/msword':
//       case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
//       case 'application/vnd.ms-excel':
//         return 'google'; // Use Google Docs viewer for Office documents
//       case 'image/jpeg':
//       case 'image/png':
//       case 'image/gif':
//       case 'image/svg+xml':
//       case 'image/webp':
//         return 'image';
//       default:
//         return 'google'; // Use Google as fallback
//     }
//   }

//   private updateViewer(): void {
//     if (!this.selectedDoc) return;
//     this.isLoading = true;
//     this.safeUrl = null;
//     this.googleViewerUrl = null;
//     this.excelData = null;

//     if (this.selectedDoc.viewer === 'pdf') {
//       this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
//         this.selectedDoc.url
//       );
//       this.isLoading = false;
//     } else if (this.selectedDoc.viewer === 'image') {
//       this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
//         this.selectedDoc.url
//       );
//       this.isLoading = false;
//     } else if (this.selectedDoc.viewer === 'google') {
//       // Encode the URL for Google Docs Viewer
//       const encodedUrl = encodeURIComponent(this.selectedDoc.url);
//       const googleViewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
//       this.googleViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleViewerUrl);
      
//       // Google Docs Viewer might take a moment to load
//       setTimeout(() => {
//         this.isLoading = false;
//       }, 1000);
//     } else if (this.selectedDoc.viewer === 'custom') {
//       this.loadExcelFile(this.selectedDoc.url);
//     }
//   }

//   private loadExcelFile(url: string): void {
//     fetch(url)
//       .then((response) => response.arrayBuffer())
//       .then((data) => {
//         const workbook = XLSX.read(data, { type: 'array' });
//         const firstSheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheetName];
//         this.excelData = XLSX.utils.sheet_to_html(worksheet);
//         this.isLoading = false;
//       })
//       .catch((error) => {
//         console.error('Error loading Excel file:', error);
//         this.excelData = '<p class="text-red-500">Error loading Excel file.</p>';
//         this.isLoading = false;
//       });
//   }

//   goBack(): void {
//     // Navigate back to the documents list
//     // You might want to store the folder ID somewhere to navigate back properly
//     this.router.navigate(['/documents']);
//   }

//   private extractFileName(url: string): string | null {
//     try {
//       // Extract filename from URL
//       const urlParts = url.split('/');
//       let fileName = urlParts[urlParts.length - 1];
      
//       // Remove query parameters if any
//       fileName = fileName.split('?')[0];
      
//       // Remove UUID prefix if present (assuming format like "uuid_filename.ext")
//       if (fileName.includes('_')) {
//         fileName = fileName.substring(fileName.indexOf('_') + 1);
//       }
      
//       return decodeURIComponent(fileName);
//     } catch {
//       return null;
//     }
//   }

//   private formatFileType(mimeType: string): string {
//     const typeMap: {[key: string]: string} = {
//       'application/pdf': 'PDF Document',
//       'application/msword': 'Word Document',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
//       'application/vnd.ms-excel': 'Excel Spreadsheet',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
//       'image/jpeg': 'JPEG Image',
//       'image/png': 'PNG Image',
//       'image/gif': 'GIF Image'
//     };
    
//     return typeMap[mimeType] || mimeType;
//   }
// }

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { SanitizeHtmlPipe } from '../../../pipe/sanitize-html.pipe';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@Component({
  selector: 'app-view-document-v2',
  imports: [CommonModule, SanitizeHtmlPipe, NgxDocViewerModule],
  templateUrl: './view-document-v2.component.html',
  styleUrl: './view-document-v2.component.css',
})
export class ViewDocumentV2Component implements OnInit {
  selectedDoc: { url: string; viewer: string; type: string } | null = null;
  safeUrl: SafeResourceUrl | null = null;
  googleViewerUrl: SafeResourceUrl | null = null;
  excelData: string | null = null;
  isLoading: boolean = true;
  viewerError: string | null = null;

  // Optional document info for the sidebar
  documentInfo: {
    name: string;
    type: string;
    size: string;
    uploadDate: string;
  } | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const { url, type } = navigation.extras.state;
      this.selectedDoc = {
        url,
        viewer: this.getViewerType(type),
        type,
      };
      console.log('Selected Document:', this.selectedDoc);

      // Mock document info - in real app, fetch this from your API
      this.documentInfo = {
        name: this.extractFileName(url) || 'Document',
        type: this.formatFileType(type),
        size: 'Unknown', // Fetch size from backend if available
        uploadDate: new Date().toLocaleDateString(),
      };
    }
  }

  ngOnInit(): void {
    if (!this.selectedDoc) {
      console.error('No document data provided');
      this.isLoading = false;
      this.viewerError = 'No document data provided.';
    } else {
      this.updateViewer();
    }
  }

  private getViewerType(fileType: string): string {
    // Supported file types by Google Docs Viewer
    const supportedTypes = [
      'application/pdf', // PDF
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'text/plain', // .txt
      'image/jpeg', // .jpg
      'image/png', // .png
      'image/gif', // .gif
      'image/webp', // .webp
      'image/svg+xml', // .svg
    ];

    if (supportedTypes.includes(fileType)) {
      return 'google'; // Use Google Docs Viewer for all supported types
    }
    return 'unsupported'; // Fallback for unsupported types
  }

  private updateViewer(): void {
    if (!this.selectedDoc) return;
    this.isLoading = true;
    this.safeUrl = null;
    this.googleViewerUrl = null;
    this.excelData = null;
    this.viewerError = null;

    if (this.selectedDoc.viewer === 'google') {
      // Construct Google Docs Viewer URL
      const encodedUrl = encodeURIComponent(this.selectedDoc.url);
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
      this.googleViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleViewerUrl);
      this.isLoading = false; // Set to false after URL is set (Google Docs Viewer handles loading)
    } else if (this.selectedDoc.viewer === 'unsupported') {
      this.isLoading = false;
      this.viewerError = `Unsupported document type: ${this.selectedDoc.type}. Please download the file to view it.`;
    }
  }

  goBack(): void {
    // Navigate back to the documents list (adjust folderId as needed)
    const folderId = this.route.snapshot.paramMap.get('folderId'); // Assuming folderId is in the route
    this.router.navigate(['/documents', folderId || '1']);
  }

  private extractFileName(url: string): string | null {
    try {
      const urlParts = url.split('/');
      let fileName = urlParts[urlParts.length - 1];
      fileName = fileName.split('?')[0]; // Remove query parameters
      if (fileName.includes('_')) {
        fileName = fileName.substring(fileName.indexOf('_') + 1); // Remove UUID prefix
      }
      return decodeURIComponent(fileName);
    } catch {
      return null;
    }
  }

  private formatFileType(mimeType: string): string {
    const typeMap: { [key: string]: string } = {
      'application/pdf': 'PDF Document',
      'application/msword': 'Word Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
      'application/vnd.ms-excel': 'Excel Spreadsheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
      'image/jpeg': 'JPEG Image',
      'image/png': 'PNG Image',
      'image/gif': 'GIF Image',
      'image/webp': 'WebP Image',
      'image/svg+xml': 'SVG Image',
      'text/plain': 'Text File',
    };
    return typeMap[mimeType] || mimeType;
  }

  onIframeError(event: Event): void {
    console.error('Iframe loading error:', event);
    this.viewerError = 'Failed to load the document. The file may be too large, the URL may have expired, or it’s incompatible with the viewer. Please try downloading the file.';
    this.isLoading = false;
  }
}