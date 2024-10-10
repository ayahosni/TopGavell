
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8000/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
