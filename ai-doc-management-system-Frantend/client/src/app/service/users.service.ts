import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = 'http://localhost:8080/api/auth';
  userData: any;

  constructor(private http:HttpClient) { }

  getUser(): Observable<any>{
    return this.http.get(`${this.baseUrl}/user`)
  }
}
