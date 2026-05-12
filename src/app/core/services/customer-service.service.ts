import { environment } from './../environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private http = inject(HttpClient);

  // ==================================================
  // GET CUSTOMER ORDERS
  // ==================================================
  getCustomerOrders(userId: string): Observable<any> {
    return this.http.get(
      `${environment.BaseUrl}/api/Customer/orders/${userId}`
    );
  }

  // ==================================================
  // GET SINGLE ORDER DETAILS
  // ==================================================
  getOrderDetails(userId: string, orderId: number): Observable<any> {
    return this.http.get(
      `${environment.BaseUrl}/api/Customer/order/${userId}/${orderId}`
    );
  }

  // ==================================================
  // CHECKOUT (CASH + ONLINE)
  // ==================================================
  checkout(data: any): Observable<any> {
    return this.http.post(
      `${environment.BaseUrl}/api/Customer/checkout`,
      data
    );
  }
}