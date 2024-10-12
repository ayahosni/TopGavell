import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Bid {
  bid_amount: string;
  customer_name: string;
  created_at: string; // Use string or Date depending on how you handle it
}

@Injectable({
  providedIn: 'root'
})
export class BidService {

  constructor(private http: HttpClient) { }

  private getAuthHeaders(includeContentType: boolean = true): HttpHeaders | undefined {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      let headersConfig: { [header: string]: string } = {
        'Authorization': `Bearer ${user.token}` 
      };
      if (includeContentType) {
        headersConfig['Content-Type'] = 'application/json'; 
      }
      return new HttpHeaders(headersConfig);
    }
    return undefined; 
  }

  placeBid(auctionId: string, bidAmount: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const options = headers ? { headers } : {};
    return this.http.post(`${environment.apiUrl}/${auctionId}/bids`, { bid_amount: bidAmount }, options);
  }

  getBidsByAuctionId(auctionId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const options = headers ? { headers } : {};
    return this.http.get<any>(`${environment.apiUrl}/${auctionId}/bids`, options);
  }
}
