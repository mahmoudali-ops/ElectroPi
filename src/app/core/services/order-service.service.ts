import { environment } from './../environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  // ==================================================
  // CREATE ORDER
  // ==================================================
  createOrder(data: any): Observable<any> {
    return this.http.post(
      `${environment.BaseUrl}/api/Order/create`,
      data
    );
  }

  // ==================================================
  // GET ALL ORDERS (ADMIN)
  // ==================================================
  getAllOrdersAdmin(): Observable<any> {
    return this.http.get(
      `${environment.BaseUrl}/api/Order/admin`
    );
  }

  // ==================================================
  // GET ORDER BY ID
  // ==================================================
  getOrderById(id: number): Observable<any> {
    return this.http.get(
      `${environment.BaseUrl}/api/Order/${id}`
    );
  }

  // ==================================================
  // GET USER ORDERS
  // ==================================================
  getUserOrders(userId: string): Observable<any> {
    return this.http.get(
      `${environment.BaseUrl}/api/Order/user/${userId}`
    );
  }

  // ==================================================
  // UPDATE ORDER STATUS
  // ==================================================
  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(
      `${environment.BaseUrl}/api/Order/update-status/${id}?status=${status}`,
      {}
    );
  }

  // ==================================================
  // DELETE ORDER
  // ==================================================
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(
      `${environment.BaseUrl}/api/Order/delete/${id}`
    );
  }
}