import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from '../services/auth.service'; // Ensure AuthService is imported

export interface Bid {
  bid_amount: string;
  customer_name: string;
  created_at: string; // Use string or Date depending on how you handle it
}

@Injectable({
  providedIn: 'root'
})
export class BidService {

  private apiUrl = environment.apiUrl; // Use the environment API URL

  constructor(private http: HttpClient, private authService: AuthService) { } // Inject AuthService

  // Helper method to get authorization headers
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

    if (this.authService.isUserBanned()) {
      return throwError({ message: "You cannot place a bid because you are banned." });
    }

    return this.http.post(`${this.apiUrl}/${auctionId}/bids`, { bid_amount: bidAmount }, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  getBidsByAuctionId(auctionId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const options = headers ? { headers } : {};
    
    return this.http.get<any>(`${this.apiUrl}/${auctionId}/bids`, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error.message || error.message);
    return throwError(error.error.message || 'An unknown error occurred. Please try again later.');
  }
}
