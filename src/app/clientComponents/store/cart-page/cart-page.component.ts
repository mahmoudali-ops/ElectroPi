import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart-service.service';
import { ICart, ICartItem } from '../../../core/interfaces/iproduct';
import { TranslatedPipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatedPipe],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {
  private readonly cartApi = inject(CartService);

  readonly cart = signal<ICart | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    if (typeof window === 'undefined') {
      this.cart.set(null);
      this.loading.set(false);
      return;
    }

    const userId = localStorage.getItem('userId') ?? '';
    if (!userId) {
      this.cart.set(null);
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.cartApi.getCheckoutCart(userId).subscribe({
      next: (res: any) => {
        const c = (res?.data ?? res) as ICart;
        this.cart.set(c);
        this.loading.set(false);
      },
      error: () => {
        this.cart.set(null);
        this.loading.set(false);
      }
    });
  }

  inc(item: ICartItem): void {
    this.cartApi.increaseQuantity(item.id).subscribe({ next: () => this.refresh() });
  }

  dec(item: ICartItem): void {
    this.cartApi.decreaseQuantity(item.id).subscribe({ next: () => this.refresh() });
  }

  remove(item: ICartItem): void {
    this.cartApi.removeItem(item.id).subscribe({ next: () => this.refresh() });
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    const userId = localStorage.getItem('userId') ?? '';
    if (!userId) return;
    this.cartApi.clearCart(userId).subscribe({ next: () => this.refresh() });
  }

  itemLines(): ICartItem[] {
    return this.cart()?.items ?? [];
  }
}
