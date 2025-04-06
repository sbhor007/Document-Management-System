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
    
    sessionStorage.setItem('token',tokenDetails.data.token)
    sessionStorage.setItem('expiryTime',(tokenDetails.data.expiryTime  + Date.now()))
    sessionStorage.setItem('roll',tokenDetails.data.roll)
  }



  isTokenExpire(): boolean {
    const expiryTime = sessionStorage.getItem('expiryTime');
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

  forgotPassword(newPasswordData:any):Observable<any>{
    return this.http.put(`${this.baseUrl}/forgot-password/${newPasswordData.email}`,newPasswordData.newPassword)
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  logOut(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expiryTime');
  }
}
