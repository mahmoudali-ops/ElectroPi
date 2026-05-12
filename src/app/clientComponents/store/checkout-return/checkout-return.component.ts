import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart-service.service';
import { TranslatedPipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-checkout-return',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatedPipe],
  template: `
    <div class="wrap">
      @if (status === 'success') {
        <h1>{{ 'STORE.ORDER_SUCCESS' | t }}</h1>
        <p class="muted">{{ 'STORE.CONTINUE_SHOPPING' | t }}</p>
      } @else {
        <h1>{{ 'STORE.ORDER_FAILED' | t }}</h1>
      }
      <a routerLink="/store" class="btn">{{ 'STORE.CONTINUE_SHOPPING' | t }}</a>
      <a routerLink="/orders" class="btn ghost">{{ 'STORE.ORDERS' | t }}</a>
    </div>
  `,
  styles: [
    `
      .wrap {
        max-width: 560px;
        margin: 0 auto;
        padding: 110px 20px 48px;
      }
      .muted {
        color: #64748b;
        margin-bottom: 16px;
      }
      .btn {
        display: inline-block;
        margin-inline-end: 10px;
        margin-top: 8px;
        padding: 10px 18px;
        border-radius: 12px;
        background: #2563eb;
        color: #fff;
        font-weight: 700;
        text-decoration: none;
      }
      .btn.ghost {
        background: #fff;
        color: #0f172a;
        border: 1px solid #e2e8f0;
      }
    `
  ]
})
export class CheckoutReturnComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly cartApi = inject(CartService);

  status: string | null = null;

  ngOnInit(): void {
    this.status = this.route.snapshot.queryParamMap.get('status');
    if (this.status === 'success') {
      const userId = localStorage.getItem('userId') ?? '';
      if (userId) {
        this.cartApi.clearCart(userId).subscribe({ error: () => {} });
      }
    }
  }
}
