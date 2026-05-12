import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductServiceService } from '../../../core/services/product-service.service';
import { CategoryService } from '../../../core/services/category-service.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatedPipe } from '../../../core/pipes/translate.pipe';
import { ProductCardComponent } from '../product-card/product-card.component';
import { IProduct, ICategory, ICategoryTranslation } from '../../../core/interfaces/iproduct';

@Component({
  selector: 'app-shop-home',
  standalone: true,
  imports: [CommonModule, TranslatedPipe, ProductCardComponent],
  templateUrl: './shop-home.component.html',
  styleUrl: './shop-home.component.css'
})
export class ShopHomeComponent implements OnInit {
  private readonly productsApi = inject(ProductServiceService);
  private readonly categoriesApi = inject(CategoryService);
  private readonly lang = inject(LanguageService);

  readonly loading = signal(true);
  readonly products = signal<IProduct[]>([]);
  readonly categories = signal<ICategory[]>([]);
  readonly selectedCategoryId = signal<number | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();
  }

  categoryLabel(c: ICategory): string {
    const code = this.lang.currentLangValue;
    const tr = c.translations?.find((t: ICategoryTranslation) => t.languageCode === code)
      ?? c.translations?.[0];
    return tr?.name ?? c.slug;
  }

  selectCategory(id: number | null): void {
    console.log('👆 Category selected. ID:', id, 'Type:', typeof id);
    this.selectedCategoryId.set(id);
    this.error.set(null);

    if (id === null) {
      this.loadAllProducts();
      return;
    }

    this.loading.set(true);
    this.productsApi.getProductsByCategory(id, this.lang.currentLangValue).subscribe({
      next: (res: any) => {
        console.log('📦 Category products API response:', res);

        const payload = Array.isArray(res)
          ? { products: res }
          : res?.data ?? res;

        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.products)
            ? payload.products
            : Array.isArray((payload as any)?.Products)
              ? (payload as any).Products
              : [];

        this.products.set(list);
        this.error.set(list.length ? null : 'No products found in this category.');
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('❌ Error loading category products:', err);
        this.error.set('Failed to load category products');
        this.products.set([]);
        this.loading.set(false);
      }
    });
  }

  private loadCategories(): void {
    this.categoriesApi.getAllCategories(this.lang.currentLangValue).subscribe({
      next: (res: any) => {
        console.log('✅ Categories loaded:', res);
        const list = Array.isArray(res) ? res : res?.data;
        this.categories.set(Array.isArray(list) ? list : []);
      },
      error: (err) => {
        console.error('❌ Error loading categories:', err);
        this.error.set('Failed to load categories');
        this.categories.set([]);
      }
    });
  }

  private loadAllProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    const lang = this.lang.currentLangValue;
    console.log('📦 Loading all products with lang:', lang);
    
    this.productsApi.getClientProducts(lang).subscribe({
      next: (res: any) => {
        console.log('📦 All Products API response:', res);
        const list = Array.isArray(res) ? res : res?.data;
        
        if (Array.isArray(list) && list.length > 0) {
          console.log('📦 First product:', list[0]);
          console.log('📦 Total products:', list.length);
        }
        
        this.products.set(Array.isArray(list) ? list : []);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('❌ Error loading all products:', err);
        this.error.set('Failed to load products');
        this.products.set([]);
        this.loading.set(false);
      }
    });
  }
}
