import { environment } from './../environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private http = inject(HttpClient);
  private readonly cartCountSubject = new BehaviorSubject<number>(0);
  readonly cartCount$ = this.cartCountSubject.asObservable();

  refreshCartCount(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const userId = localStorage.getItem('userId') ?? '';
    if (!userId) {
      this.cartCountSubject.next(0);
      return;
    }

    this.getCheckoutCart(userId).subscribe({
      next: (res: any) => {
        const items = (res?.data ?? res)?.items ?? [];
        const sum = (items as Array<{ quantity?: number }>).reduce(
          (total, item) => total + (item.quantity ?? 0),
          0
        );
        this.cartCountSubject.next(sum);
      },
      error: () => {
        this.cartCountSubject.next(0);
      }
    });
  }

  // ==================================================
  // ADD ITEM TO CART
  // ==================================================
  addToCart(data: any): Observable<any> {
    return this.http.post(
      `${environment.BaseUrl}/api/Cart/add`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  // ==================================================
  // INCREASE QUANTITY
  // ==================================================
  increaseQuantity(cartItemId: number): Observable<any> {
    return this.http.put(
      `${environment.BaseUrl}/api/Cart/increase/${cartItemId}`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  // ==================================================
  // DECREASE QUANTITY
  // ==================================================
  decreaseQuantity(cartItemId: number): Observable<any> {
    return this.http.put(
      `${environment.BaseUrl}/api/Cart/decrease/${cartItemId}`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  // ==================================================
  // REMOVE ITEM
  // ==================================================
  removeItem(cartItemId: number): Observable<any> {
    return this.http.delete(
      `${environment.BaseUrl}/api/Cart/remove/${cartItemId}`,
      { withCredentials: true }
    ).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  // ==================================================
  // GET CHECKOUT CART
  // ==================================================
  getCheckoutCart(userId: string): Observable<any> {
    return this.http.get(
      `${environment.BaseUrl}/api/Cart/checkout/${userId}`,
      { withCredentials: true }
    );
  }

  // ==================================================
  // CLEAR CART
  // ==================================================
  clearCart(userId: string): Observable<any> {
    return this.http.delete(
      `${environment.BaseUrl}/api/Cart/clear/${userId}`,
      { withCredentials: true }
    ).pipe(
      tap(() => this.refreshCartCount())
    );
  }
}