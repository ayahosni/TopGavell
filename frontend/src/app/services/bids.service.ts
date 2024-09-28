import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BidsService {
  private apiUrl = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient) {}

  private getToken(): string | null { 
    return localStorage.getItem('token');
  }

  // Function to place a bid
  placeBid(auctionId: number, bidAmount: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Add content type here
    });
    
    const url = `${this.apiUrl}/${auctionId}/bids`;
    const body = { bid_amount: bidAmount };

    return this.http.post(url, body, { headers }); // Use the headers variable here
  }
}
  

