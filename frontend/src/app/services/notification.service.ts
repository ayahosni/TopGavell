import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface PaginatedNotifications {
  data: Notification[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error code: ${error.status}, Message: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  getNotifications(page: number = 1, perPage: number = 10): Observable<PaginatedNotifications> {
    const token = localStorage.getItem('authToken'); 

    // Ensure token is available
    if (!token) {
      return throwError('Authentication token is missing.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<PaginatedNotifications>(`${environment.apiUrl}/notifications`, { headers, params })
      .pipe(catchError(this.handleError));
  }
}
