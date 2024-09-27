import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apiUrl = 'http://172.18.0.2:80/api'; // ===> Docker Url
  // private apiUrl = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient){}

  addComment(comment_text: string, auctionID: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`,});
    return this.http.post(this.apiUrl+'/'+auctionID+'/comments', comment_text,{ headers });
  }

}
