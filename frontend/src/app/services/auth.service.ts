import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private Url = 'http://172.18.0.5:80/api'; // ===> Docker URL
  private Url = 'http://localhost:8000/api'; // ===> Localhost URL

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.Url}/register`, userData).pipe(
      map((response: any) => {
        if (response && response.token) {
          const userData = {
            token: response.token,
            email_verified_at : response.user.email_verified_at,
            email: response.user.email,
            name: response.user.name
          };
          localStorage.setItem('user', JSON.stringify(userData));
        }
        return response;
      })
    );
  }


  logIn(userData: any): Observable<any> {
    return this.http.post(`${this.Url}/login`, userData).pipe(
      map((response: any) => {
        if (response && response.token) {
          const userData = {
            token: response.token,
            email_verified_at : response.user.email_verified_at,
            email: response.user.email,
            name: response.user.name
          };
          localStorage.setItem('user', JSON.stringify(userData));
        }
        return response;
      })
    );
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return user !== null;
  }
  
  logOut(): void {
    localStorage.removeItem('user');
  }
}