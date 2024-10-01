import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BidService {

  private apiUrl = 'http://localhost:8000/api'; // API URL

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

  placeBid(auctionId: string, bidAmount: number, bidData: any): Observable<any> {
    const isFormData = bidData instanceof FormData; 
    const headers = this.getAuthHeaders(!isFormData);
    const options = headers ? { headers } : {}; 

    return this.http.post(`${this.apiUrl}/${auctionId}/bids`, { bid_amount: bidAmount, ...bidData }, options);
  }

  getBidsByAuctionId(auctionId: string): Observable<any> {
    const headers = this.getAuthHeaders(); 
    const options = headers ? { headers } : {}; 

    return this.http.get(`${this.apiUrl}/${auctionId}/bids`, options);
  }
}
