import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  baseUrl = 'http://localhost:8080/api/folders'

  constructor(private http:HttpClient) { }

  getAllFolders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all-folders`)
  }

  createFolder(folder: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-folder`, folder)
  }

}
