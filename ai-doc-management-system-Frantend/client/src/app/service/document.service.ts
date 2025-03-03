import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  baseUrl = 'http://localhost:8080/api/documentsV1';
  constructor(private http:HttpClient) { }

  uploadDocuments(file: File[],folderId:number):Observable<any> {
    const formData = new FormData();
    file.forEach((file,index) => {
      formData.append('files', file,file.name);
    })
    return this.http.post<File[]>(`${this.baseUrl}/upload/${folderId}`, formData);
  }

  getDocuments(folderId:number):Observable<File[]> {
  return this.http.get<File[]>(`${this.baseUrl}/folder/${folderId}`);
  }

  getPreSignedUrl(documentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/presigned/${documentId}`);
  }

  downloadDocument(documentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/download/${documentId}`);
  }
}
