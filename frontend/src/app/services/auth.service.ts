import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, userData).pipe(
      map((response: any) => {
        if (response && response.token) {
          const userData = {
            token: response.token,
            role: response.user.role,
            id:response.user.id,
            is_email_verified: response.user.is_email_verified,
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
    return this.http.post(`${environment.apiUrl}/login`, userData).pipe(
      map((response: any) => {
        if (response && response.token) {
          const userData = {
            token: response.token,
            role: response.user.role,
            id: response.user.id,
            is_email_verified: response.user.is_email_verified,
            email: response.user.email,
            name: response.user.name,
            isBanned: response.user.banned
          };
  
          localStorage.setItem('user', JSON.stringify(userData));
  
          return response;
        }
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  

  logOut(): Observable<any> {
    const user = localStorage.getItem('user');
    if (user) {
      const token = JSON.parse(user).token; // Retrieve token from local storage
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}` // Add token to Authorization header
      });
  
      return this.http.get(`${environment.apiUrl}/logout`, { headers }).pipe(
        tap(() => {
          localStorage.removeItem('user'); // Clear local storage after successful logout
        }),
        catchError((error) => {
          console.error('Logout failed', error);
          return throwError(error); // Handle error accordingly
        })
      );
    } else {
      return of({ message: 'No user logged in' });
    }
  }



  verifyEmail(email: string, otp: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/email_verify`, { email, otp });
  }

  is_email_verified(): boolean {
    const userJson = localStorage.getItem('user');
    if (userJson){
      const user = JSON.parse(userJson);
      return user.is_email_verified == 1;
    }
    return false;
  }

  is_admin(): boolean {
    const userJson = localStorage.getItem('user');
    if (userJson){
      const user = JSON.parse(userJson);
      return user.role == 'admin';
    }
    return false;
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return user !== null;
  }
  getUserData() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;    
  }
  isUserBanned(): boolean {
    const userData = localStorage.getItem('user'); 
    if (userData) {
      const user = JSON.parse(userData); 
  
      return user.isBanned === 1;
    }
    return false;
  }
  
}