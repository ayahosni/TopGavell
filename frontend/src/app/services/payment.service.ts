import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

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

  checkout(auctionId: string): Observable<any> {
    const headers = this.getAuthHeaders(); 
    const options = headers ? { headers } : {}; 
    return this.http.post(`${this.apiUrl}/checkout/${auctionId}`, options);
  }
}