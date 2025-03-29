import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  baseUrl = 'http://localhost:8080/api/documentsv2';
  openedDocument: any[] = [];

  constructor(private http: HttpClient) {}

  addOpenedDocument(document: any) {
    const exists = this.openedDocument.some((doc) => doc.id === document.id);
    if (!exists) {
      if (this.openedDocument.length > 3) {
      this.openedDocument.pop(); // Remove the oldest document
      }
      this.openedDocument.unshift(document)
      // this.openedDocument.push(document);
    }
  }

  uploadDocuments(files: File[], folderId: number): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file, file.name));
    return this.http.post(`${this.baseUrl}/upload/${folderId}`, formData);
  }

  getDocuments(folderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/folder/${folderId}`);
  }

  // Updated to fetch document metadata by ID (if needed)
  getDocument(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getPreSignedUrl(documentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/presigned/${documentId}`);
  }

  downloadDocument(documentId: number): Observable<Blob> {
    return this.http
      .get(`${this.baseUrl}/download/${documentId}`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status !== 200) {
            throw new Error(`Download failed with status ${response.status}`);
          }
          return response.body as Blob;
        }),
        catchError((error: any) => {
          console.error('Download error:', error);
          return throwError(() => new Error('Failed to download document'));
        })
      );
  }

  getAllDocuments(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  deleteDocument(documentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${documentId}`);
  }
}
