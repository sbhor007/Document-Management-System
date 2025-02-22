import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  baseUrl = 'http://localhost:8080/api/documents';
  constructor(private http:HttpClient) { }

  uploadDocuments(file: File[],folderId:number):Observable<File[]> {
    return this.http.post<File[]>(this.baseUrl, file);
  }

  getDocuments(folderId:number):Observable<File[]> {
  return this.http.get<File[]>(`${this.baseUrl}/folder/${folderId}`);
  }
}
