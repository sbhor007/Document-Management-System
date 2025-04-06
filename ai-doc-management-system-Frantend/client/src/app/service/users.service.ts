import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = 'http://localhost:8080/api/auth';
  userData: any;
  totalUsedStorage:number = 0

  constructor(private http:HttpClient) { }

  calculateTotalStorage(size:number){
    this.totalUsedStorage += size
  }

  getTotalUsedStorage(){
    return this.totalUsedStorage
  }

  getUser(): Observable<any>{
    return this.http.get(`${this.baseUrl}/user`)
  }
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all-users`);
  }

  deleteUser(username:string):Observable<any>{
    return this.http.delete(`${this.baseUrl}/users/${username}`)
  }


}
