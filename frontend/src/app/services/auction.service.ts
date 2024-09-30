// auction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  // private apiUrl = 'http://172.18.0.3:80/api'; // ===> Docker URL
  private apiUrl = 'http://localhost:8000/api/auction'; // API URL

  constructor(private http: HttpClient) { }

  // Function to get authorization headers
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
  

  // Error handling for HTTP responses
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Authentication error: Token is missing or invalid. Please log in again.';
      } else {
        errorMessage = `Error code: ${error.status}, Message: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }

  // Create a new auction
  createAuction(auctionData: any): Observable<any> {
    const isFormData = auctionData instanceof FormData;
    const headers = this.getAuthHeaders(!isFormData);
  
    // إذا كانت الرؤوس غير معرفة، لا تمررها في الطلب
    const options = headers ? { headers } : {};
  
    return this.http.post(this.apiUrl, auctionData, options)
      .pipe(catchError(this.handleError)); // Handle errors
  }
  

  getAuctions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get all auctions
  getAllAuctions(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError('Token is missing. Please log in.');
    }
    return this.http.get<any>(this.apiUrl, { headers })
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }


  // Get auction by ID
  // Get auction by ID
getAuctionById(id: string): Observable<any> {
  const headers = this.getAuthHeaders();
  if (!headers) {
    return throwError('Token is missing. Please log in.'); // Return error if token is missing
  }
  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers })
    .pipe(catchError(this.handleError)); // Handle errors
}


  // Update an existing auction
  updateAuction(id: string, auctionData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError('Token is missing. Please log in.'); // Return error if token is missing
    }
    return this.http.put(`${this.apiUrl}/${id}`, auctionData, { headers })
      .pipe(catchError(this.handleError)); // Handle errors
  }

  // Delete an auction
  deleteAuction(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError('Token is missing. Please log in.'); // Return error if token is missing
    }
    return this.http.delete(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError)); // Handle errors
  }
}
