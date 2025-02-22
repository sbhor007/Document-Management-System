import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  baseUrl = 'http://localhost:8080/api/documents';
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
}
