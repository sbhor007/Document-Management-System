import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http:HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  storeTokenDetails(tokenDetails:any):void{
    
    localStorage.setItem('token',tokenDetails.data.token)
    localStorage.setItem('expiryTime',(tokenDetails.data.expiryTime  + Date.now()))
  }



  isTokenExpire(): boolean {
    const expiryTime = localStorage.getItem('expiryTime');
    if (expiryTime) {
      const now = new Date().getTime();
      if (now > parseInt(expiryTime)) {
        return true;
      }
    }
    return false;
  }


  checkEmailExists(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/email-exists/${email}`);
  }

  registerUser(user:any): Observable<any>{
    console.log(user);
    return this.http.post(`${this.baseUrl}/register`,user)
  }

  loginUser(userCredential:any): Observable<any>{
    const loginHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return this.http.post(`${this.baseUrl}/logins`,userCredential,{ headers: loginHeaders })
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryTime');
  }
}
