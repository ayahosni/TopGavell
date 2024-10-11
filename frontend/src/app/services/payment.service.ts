import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8000/api';
/*   private apiUrl = 'http://172.18.0.4:80/api';
 */  constructor(private http: HttpClient) { }

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

  createCheckoutSession(auctionId: string) {
    const headers = this.getAuthHeaders();
    const options = headers ? { headers } : {};
    const body = {auction_id: auctionId,};
    return this.http.post<{ id: string }>(`${environment.apiUrl}/create-checkout-session`, body, options);
  }

  checkPayment(auctionId: any): Observable<{ hasPaid: boolean }> {
    const headers = this.getAuthHeaders();
    const options = headers ? { headers } : {};
    const body = {auction_id: auctionId,};
    return this.http.post<{ hasPaid: boolean }>(`${this.apiUrl}/check-payment`, body,options);
  }
}
