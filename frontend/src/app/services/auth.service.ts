import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private Url = 'http://172.18.0.5:80/api'; // ===> Docker Url
  private Url = 'http://localhost:8000/api'; // ===> Localhost Url

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.Url}/register`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.Url}/login`, userData).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('userToken', response.token);
        }
        return response;
      })
    );
  }

  createAuction(auctionData: any): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.post(`${this.Url}/auction`, auctionData, { headers });
  }

  getAllData(): Observable<any> {
    return this.http.get(`${this.Url}/auction`);
  }

  logout(): void {
    localStorage.removeItem('userToken'); 
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('userToken'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    });
  }
}
