import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private apiUrl = 'http://localhost:8000/api/auction'; 

  constructor(private http: HttpClient) {}

  // Create a new auction
  createAuction(auctionData: any): Observable<any> {
    return this.http.post(this.apiUrl, auctionData);
  }

  getAllAuctions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAuctionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  
  updateAuction(id: string, auctionData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, auctionData);
  }

  
  deleteAuction(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
