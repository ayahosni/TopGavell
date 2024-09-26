import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private apiUrl = 'http://172.18.0.2:80/api/auction'; // ===> Docker Url
  // private apiUrl = 'http://localhost:8000/api/auction'; 

  constructor(private http: HttpClient) { }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Create a new auction
  createAuction(auctionData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`,});
    return this.http.post(this.apiUrl, auctionData,{ headers });
  }

  getAllAuctions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAuctionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }


  updateAuction(id: string, auctionData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`,});
    return this.http.put(`${this.apiUrl}/${id}`, auctionData,{ headers });
  }


  deleteAuction(id: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`,});
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers });
  }
}
