import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart-service.service';
import { OrderService } from '../../../core/services/order-service.service';
import { PaymentService } from '../../../core/services/payment.service';
import { ICart, ICreateOrder, ICartItem } from '../../../core/interfaces/iproduct';
import { TranslatedPipe } from '../../../core/pipes/translate.pipe';
import { ToastrService } from 'ngx-toastr';
import { StripeSessionResponse } from '../../../core/services/payment.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatedPipe],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css'
})
export class CheckoutPageComponent implements OnInit {
  private readonly cartApi = inject(CartService);
  private readonly orderApi = inject(OrderService);
  private readonly paymentApi = inject(PaymentService);
  private readonly toast = inject(ToastrService);
  private readonly router = inject(Router);

  readonly cart = signal<ICart | null>(null);
  readonly loading = signal(true);
  readonly busy = signal(false);
  paymentMethod: 'CashOnDelivery' | 'Online' = 'CashOnDelivery';

  ngOnInit(): void {
    const userId = localStorage.getItem('userId') ?? '';
    if (!userId) {
      this.loading.set(false);
      return;
    }
    this.cartApi.getCheckoutCart(userId).subscribe({
      next: (res: any) => {
        this.cart.set((res?.data ?? res) as ICart);
        this.loading.set(false);
      },
      error: () => {
        this.cart.set(null);
        this.loading.set(false);
      }
    });
  }

  submit(): void {
    const userId = localStorage.getItem('userId') ?? '';
    const cart = this.cart();
    if (!userId || !cart?.items?.length || this.busy()) return;

    const body: ICreateOrder = {
      userId,
      paymentMethod: this.paymentMethod,
      orderItems: cart.items.map((i: ICartItem) => ({
        productId: i.productId,
        quantity: i.quantity
      }))
    };

    this.busy.set(true);
    this.orderApi.createOrder(body).subscribe({
      next: (res: any) => {
        const orderId = Number(res?.data?.id ?? res?.id ?? res?.orderId ?? 0);
        if (this.paymentMethod === 'Online' && orderId > 0 && typeof window !== 'undefined') {
          const origin = window.location.origin;
          this.paymentApi
            .createCheckoutSession({
              orderId,
              successUrl: `${origin}/checkout/return?status=success`,
              cancelUrl: `${origin}/checkout/return?status=cancel`
            })
            .subscribe({
              next: (session: StripeSessionResponse) => {
                const url = session.url ?? session.sessionUrl;
                if (url) {
                  window.location.href = url;
                } else {
                  this.toast.error('No checkout URL from server');
                  this.busy.set(false);
                }
              },
              error: () => {
                this.toast.error('Stripe session failed');
                this.busy.set(false);
              }
            });
        } else {
          this.toast.success('Order placed');
          this.router.navigate(['/orders']);
          this.busy.set(false);
        }
      },
      error: () => {
        this.toast.error('Order failed');
        this.busy.set(false);
      }
    });
  }
}
