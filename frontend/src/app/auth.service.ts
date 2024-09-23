// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://127.0.0.1:8000/api'; 

//   constructor(private http: HttpClient) { }

//   register(data: any): Observable<any> {
//     console.log(`${this.apiUrl}/register`);
//     return this.http.post(`${this.apiUrl}/register`, data);
//   }

//   login(data: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, data);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post(`${this.Url}/login`, userData);
  }

  getAllData(): Observable<any> {
    return this.http.get(`${this.Url}/auction`);
  }
}
