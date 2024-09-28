import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private apiUrl = 'http://localhost:8000/api/auction'; 

  constructor(private http: HttpClient) { }

  private getToken(): string | null { 
    return localStorage.getItem('token');
  }

  createAuction(auctionData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.post(this.apiUrl, auctionData, { headers }).pipe(
      catchError(err => {
        console.error('Error creating auction:', err);
        return of(null);
      })
    );
  }

  getAllAuctions(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => {
        console.log('API Response:', response); 
        return Array.isArray(response.data) ? response.data : [];
      }),
      catchError(err => {
        console.error('Error fetching auctions:', err);
        return of([]);
      })
    );
  }
  
  // جلب مزايدة معينة بواسطة ID
  getAuctionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // تحديث مزايدة
  updateAuction(id: string, auctionData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.put(`${this.apiUrl}/${id}`, auctionData, { headers }).pipe(
      catchError(err => {
        console.error('Error updating auction:', err);
        return of(null);
      })
    );
  }

  // حذف مزايدة
  deleteAuction(id: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(err => {
        console.error('Error deleting auction:', err);
        return of(null);
      })
    );
  }
}
