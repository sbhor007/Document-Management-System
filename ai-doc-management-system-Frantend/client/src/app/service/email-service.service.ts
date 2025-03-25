import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {

  private baseUrl = 'http://localhost:8080/api/email';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  

  // sendOtp(email: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/sendOtp`, JSON.stringify(email), this.httpOptions);
  // }

  // validateOtp(email: string, otp: string): Observable<any> {
  //   console.log("service : ", otp);
    
  //   return this.http.post(`${this.baseUrl}/validateOtp/${email}/${otp}`, this.httpOptions);
  // }
  sendOtp(email: string): Observable<boolean> {
    return this.http.post<any>(`${this.baseUrl}/sendOtp`, email)
      .pipe(
        map(response => {
          if (response.status === 'success') {
            return true;
          }
          throw new Error(response.message || 'Failed to send OTP');
        })
      );
  }

  verifyOtp(email: string, otp: string): Observable<boolean> {
    return this.http.post<any>(`${this.baseUrl}/validateOtp/${email}/${otp}`, {})
      .pipe(
        map(response => {
          if (response.status === 'success') {
            return true;
          }
          throw new Error(response.message || 'OTP Validation Failed');
        })
      );
  }
}
