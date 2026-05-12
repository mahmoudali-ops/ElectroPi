import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductServiceService } from '../../../core/services/product-service.service';
import { CartService } from '../../../core/services/cart-service.service';
import { TranslatedPipe } from '../../../core/pipes/translate.pipe';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../../../core/interfaces/iproduct';
import { environment } from '../../../core/environments/environments';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatedPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsApi = inject(ProductServiceService);
  private readonly cartApi = inject(CartService);
  private readonly toast = inject(ToastrService);

  readonly product = signal<IProduct | null>(null);
  readonly activeImage = signal<string>('');
  readonly loading = signal(true);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.loading.set(false);
      return;
    }
    this.productsApi.getProductBySlug(slug).subscribe({
      next: (res: any) => {
        const p = (res?.data ?? res) as IProduct;
        this.product.set(p);
        const rawUrl =
          p.mainImage ??
          p.images?.find((i) => i.isMain)?.imageUrl ??
          p.images?.[0]?.imageUrl ??
          (p as any).imageUrl ??
          (p as any).image ??
          '';
        this.activeImage.set(this.normalizeImageUrl(rawUrl));
        this.loading.set(false);
      },
      error: () => {
        this.product.set(null);
        this.loading.set(false);
      }
    });
  }

  pickImage(url: string): void {
    this.activeImage.set(this.normalizeImageUrl(url));
  }

  addOne(): void {
    const p = this.product();
    if (!p?.isAvailable) return;
    this.cartApi.addToCart({ productId: p.id, quantity: 1 }).subscribe({
      next: () => {
        this.toast.success('Added to cart');
        this.cartApi.refreshCartCount();
      },
      error: () => this.toast.error('Failed')
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
