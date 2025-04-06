import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import * as XLSX from 'xlsx';
import * as mammoth from 'mammoth';
import { SanitizeHtmlPipe } from '../../../pipe/sanitize-html.pipe';
import { Router } from '@angular/router';
import { DocumentService } from '../../../service/document.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-view-document',
  imports: [NgxDocViewerModule, CommonModule, SanitizeHtmlPipe, NgxExtendedPdfViewerModule],
  templateUrl: './view-document.component.html',
  styleUrl: './view-document.component.css',
})
export class ViewDocumentComponent implements OnInit, OnDestroy {
  selectedDoc: { url: string; viewer: string; type: string; document?: any; blob?: Blob } | null = null;
  safeUrl: SafeResourceUrl | null = null;
  excelData: string | null = null;
  docxContent: SafeHtml | null = null;
  // docxContent:any
  loading: boolean = false;
  error: string | null = null;
  pdfLoadError: boolean = false;
  imageZoom: number = 1;
  currentExcelSheet: string = '';
  excelWorkbook: XLSX.WorkBook | null = null;

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
    this.docxContent = null;
    this.pdfLoadError = false;
    this.imageZoom = 1;

    if (this.selectedDoc.viewer === 'custom' && this.selectedDoc.blob) {
      this.loadExcelFile(this.selectedDoc.blob);
    } else if (this.selectedDoc.viewer === 'mammoth' && this.selectedDoc.blob) {
      this.loadDocxFile(this.selectedDoc.blob);
    }
  }

  private loadDocxFile(blob: Blob): void {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      mammoth.convertToHtml({arrayBuffer: arrayBuffer}, {
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Heading 4'] => h4:fresh",
          "p:empty => p.empty-paragraph:fresh"
        ]
      })
      .then(result => {
        // Add custom CSS for better styling
        const styledContent = `
          <style>
            .mammoth-content {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .mammoth-content h1 {
              font-size: 1.8em;
              margin-top: 1em;
              margin-bottom: 0.5em;
              padding-bottom: 0.3em;
              border-bottom: 1px solid #eaecef;
            }
            .mammoth-content h2 {
              font-size: 1.5em;
              margin-top: 1em;
              margin-bottom: 0.5em;
            }
            .mammoth-content h3 {
              font-size: 1.3em;
              margin-top: 0.8em;
              margin-bottom: 0.3em;
            }
            .mammoth-content p {
              margin-bottom: 1em;
            }
            .mammoth-content table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 1em;
            }
            .mammoth-content th, .mammoth-content td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            .mammoth-content th {
              background-color: #f6f8fa;
              text-align: left;
            }
            .mammoth-content tr:nth-child(even) {
              background-color: #f6f8fa;
            }
            .mammoth-content ul, .mammoth-content ol {
              padding-left: 2em;
              margin-bottom: 1em;
            }
            .mammoth-content img {
              max-width: 100%;
              height: auto;
            }
            .empty-paragraph {
              min-height: 1em;
            }
          </style>
          ${result.value}
        `;
        // TODO
        this.docxContent = this.sanitizer.bypassSecurityTrustHtml(styledContent);
      })
      .catch(error => {
        console.error("Error converting DOCX:", error);
        this.docxContent = null; // Will fallback to ngx-doc-viewer
      });
    };
    reader.onerror = () => {
      console.error("Error reading DOCX file");
      this.docxContent = null; // Will fallback to ngx-doc-viewer
    };
    reader.readAsArrayBuffer(blob);
  }

  private loadExcelFile(blob: Blob): void {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = reader.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: 'array' });
        this.excelWorkbook = workbook;
        
        if (workbook.SheetNames.length === 0) {
          this.excelData = '<p>No sheets found in Excel file.</p>';
          return;
        }

        // Create tabs for each sheet
        let sheetNav = `
          <div class="sheet-tabs flex mb-4 border-b">
        `;
        
        workbook.SheetNames.forEach((name, index) => {
          const isActive = index === 0;
          this.currentExcelSheet = isActive ? name : this.currentExcelSheet || name;
          
          sheetNav += `
            <button 
              id="tab-${name.replace(/[^a-z0-9]/gi, '-')}" 
              class="sheet-tab px-4 py-2 ${isActive ? 'bg-blue-100 border-b-2 border-blue-500' : 'hover:bg-gray-100'}"
              onclick="document.querySelectorAll('.excel-sheet').forEach(s => s.style.display = 'none');
                      document.querySelectorAll('.sheet-tab').forEach(t => t.classList.remove('bg-blue-100', 'border-b-2', 'border-blue-500'));
                      document.getElementById('sheet-${name.replace(/[^a-z0-9]/gi, '-')}').style.display = 'block';
                      document.getElementById('tab-${name.replace(/[^a-z0-9]/gi, '-')}').classList.add('bg-blue-100', 'border-b-2', 'border-blue-500');">
              ${name}
            </button>
          `;
        });
        
        sheetNav += `</div>`;

        // Generate content for all sheets
        let allSheets = '';
        workbook.SheetNames.forEach((name, index) => {
          const worksheet = workbook.Sheets[name];
          const htmlTable = XLSX.utils.sheet_to_html(worksheet, { id: `table-${name}` });
          const isActive = index === 0;
          
          allSheets += `
            <div class="excel-sheet" id="sheet-${name.replace(/[^a-z0-9]/gi, '-')}" style="display: ${isActive ? 'block' : 'none'}">
              ${htmlTable}
            </div>
          `;
        });

        // Add styling
        this.excelData = `
          <style>
            /* Excel styling */
            .sheet-tabs {
              user-select: none;
            }
            .sheet-tab {
              transition: all 0.2s;
              font-size: 14px;
              outline: none;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              font-family: Arial, sans-serif;
              font-size: 14px;
            }
            table th {
              background-color: #f2f2f2;
              font-weight: bold;
              text-align: left;
              border: 1px solid #ddd;
              padding: 8px;
              position: sticky;
              top: 0;
              z-index: 10;
            }
            table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              vertical-align: top;
            }
            table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            table tr:hover {
              background-color: #f0f0f0;
            }
          </style>
          ${sheetNav}
          ${allSheets}
        `;
      } catch (error) {
        console.error('Error processing Excel file:', error);
        this.excelData = '<p>Error processing Excel file. Please download to view.</p>';
      }
    };
    
    reader.onerror = () => {
      this.excelData = '<p>Error loading Excel file.</p>';
    };
    
    reader.readAsArrayBuffer(blob);
  }

  canZoom(): boolean {
    return this.selectedDoc?.viewer === 'image' || this.selectedDoc?.viewer === 'custom' || this.selectedDoc?.viewer === 'mammoth';
  }

  zoomIn(): void {
    if (this.selectedDoc?.viewer === 'image') {
      this.imageZoom += 0.1;
    } else if (this.selectedDoc?.viewer === 'custom' || this.selectedDoc?.viewer === 'mammoth') {
      // Apply zoom for Excel and Word documents
      const contentDiv = document.querySelector(this.selectedDoc.viewer === 'custom' ? '.excel-sheet' : '.mammoth-content');
      if (contentDiv) {
        const currentScale = parseFloat(contentDiv.getAttribute('data-scale') || '1');
        const newScale = currentScale + 0.1;
        contentDiv.setAttribute('data-scale', newScale.toString());
        (contentDiv as HTMLElement).style.transform = `scale(${newScale})`;
        (contentDiv as HTMLElement).style.transformOrigin = 'top left';
      }
    }
  }

  zoomOut(): void {
    if (this.selectedDoc?.viewer === 'image') {
      if (this.imageZoom > 0.3) {
        this.imageZoom -= 0.1;
      }
    } else if (this.selectedDoc?.viewer === 'custom' || this.selectedDoc?.viewer === 'mammoth') {
      // Apply zoom out for Excel and Word documents
      const contentDiv = document.querySelector(this.selectedDoc.viewer === 'custom' ? '.excel-sheet' : '.mammoth-content');
      if (contentDiv) {
        const currentScale = parseFloat(contentDiv.getAttribute('data-scale') || '1');
        if (currentScale > 0.3) {
          const newScale = currentScale - 0.1;
          contentDiv.setAttribute('data-scale', newScale.toString());
          (contentDiv as HTMLElement).style.transform = `scale(${newScale})`;
          (contentDiv as HTMLElement).style.transformOrigin = 'top left';
        }
      }
    }
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
    // PDF loaded successfully
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