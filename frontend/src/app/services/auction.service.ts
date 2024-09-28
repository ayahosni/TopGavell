import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private apiUrl = 'http://localhost:8000/api/auction'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('auth_token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      });
    }
    return null; 
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred.';
    if (error.error instanceof ErrorEvent) {

      errorMessage = `Error: ${error.error.message}`;
    } else {

      if (error.status === 401) {
        errorMessage = 'Authentication error: Token is missing or invalid. Please log in again.';
      } else {
        errorMessage = `Error code: ${error.status}, Message: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }

  createAuction(auctionData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError('Token is missing. Please log in.');
    }
    return this.http.post(this.apiUrl, auctionData, { headers })
      .pipe(catchError(this.handleError)); 
  }

  getAllAuctions(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError('Token is missing. Please log in.');
    }
    return this.http.get<any[]>(this.apiUrl, { headers })
      .pipe(catchError(this.handleError)); 
  }


  getAuctionById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError('Token is missing. Please log in.');
    }
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError)); 
  }

  updateAuction(id: string, auctionData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError('Token is missing. Please log in.');
    }
    return this.http.put(`${this.apiUrl}/${id}`, auctionData, { headers })
      .pipe(catchError(this.handleError)); 
  }

  deleteAuction(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError('Token is missing. Please log in.');
    }
    return this.http.delete(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }
}
