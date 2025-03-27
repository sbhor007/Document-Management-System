import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  baseUrl = 'http://localhost:8080/api/folders';

  constructor(private http: HttpClient) {}

  getAllFolders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all-folders`);
  }

  createFolder(folder: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-folder`, folder);
  }

  // Get folder details by ID
  getFolderDetails(folderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${folderId}`);
  }

  // In FolderService (Angular)
  updateFolder(folderId: number, folderData: any) {
    return this.http.put(`/api/folders/${folderId}`, folderData);
  }

  // Delete folder by ID
  deleteFolder(folderId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${folderId}`);
  }

  private getUsername(): string {
    // Replace with your actual authentication logic
    return localStorage.getItem('username') || 'default_user';
  }

}
