import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
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

  createComment(auctionId: string, commentData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const options = headers ? { headers } : {};
    return this.http.post(`${environment.apiUrl}/${auctionId}/comments`, commentData, options);
  }

  getCommentsByAuctionId(auctionId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const options = headers ? { headers } : {};
    return this.http.get(`${environment.apiUrl}/${auctionId}/comments`, options); 
  }

  updateComment(auctionId: string, commentId: string, commentData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const options = headers ? { headers } : {};
    return this.http.put(`${environment.apiUrl}/${auctionId}/comments/${commentId}`, commentData, options);
  }

  deleteComment(auctionId: string, commentId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const options = headers ? { headers } : {};
    return this.http.delete(`${environment.apiUrl}/${auctionId}/comments/${commentId}`, options);
  }
}