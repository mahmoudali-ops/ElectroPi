import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../../core/interfaces/iproduct';
import { TranslatedPipe } from '../../../core/pipes/translate.pipe';
import { environment } from '../../../core/environments/environments';
import { CartService } from '../../../core/services/cart-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatedPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: IProduct;

  private readonly cartApi = inject(CartService);
  private readonly toast = inject(ToastrService);

  cover(): string {
    const raw =
      this.product.mainImage ||
      this.product.images?.find((i) => (i as any)?.isMain)?.imageUrl ||
      this.product.images?.[0]?.imageUrl ||
      (this.product as any).imageUrl ||
      (this.product as any).image ||
      '';
    return this.normalizeImageUrl(raw);
  }

  addToCart(): void {
    const product = this.product;
    if (!product?.isAvailable) return;
    this.cartApi.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: () => {
        this.toast.success('Added to cart');
        this.cartApi.refreshCartCount();
      },
      error: () => {
        this.toast.error('Unable to add product');
      }
    });
  }

  private normalizeImageUrl(url: string): string {
    if (!url) return '';
    const trimmed = url.trim();
    if (/^(https?:)?\/\//.test(trimmed)) {
      return trimmed;
    }
    return `${environment.BaseUrl}/${trimmed.replace(/^\/+/, '')}`;
  }
}
