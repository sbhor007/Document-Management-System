import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Documentv2Service {

  baseUrl = 'http://localhost:8080/api/documentsv2';
  
  constructor(private http: HttpClient) { }

  uploadDocuments(files: File[], folderId: number): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file, file.name);
    });
    return this.http.post(`${this.baseUrl}/upload/${folderId}`, formData);
  }

  getDocuments(folderId: number): Observable<any> {  // Changed to any to match your controller's response
    return this.http.get(`${this.baseUrl}/folder/${folderId}`);
  }

  getPreSignedUrl(documentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/presigned/${documentId}`);
  }

  downloadDocument(documentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/download/${documentId}`, {
      responseType: 'blob'  // Added responseType for proper file handling
    });
  }

  // Added delete method
  deleteDocument(documentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${documentId}`);
  }
}
