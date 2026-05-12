import { environment } from './../environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface StripeSessionResponse {
  url?: string;
  sessionUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);

  /**
   * Starts hosted Stripe Checkout. Backend should return { url: string }.
   * Change the path to match your controller.
   */
  createCheckoutSession(body: { orderId: number; successUrl: string; cancelUrl: string }): Observable<StripeSessionResponse> {
    return this.http.post<StripeSessionResponse>(
      `${environment.BaseUrl}/api/Payment/create-checkout-session`,
      body
    );
  }
}
