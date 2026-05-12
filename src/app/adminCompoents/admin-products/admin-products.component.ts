import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../core/services/product-service.service';
import { CategoryService } from '../../core/services/category-service.service';
import { IProduct, ICategory } from '../../core/interfaces/iproduct';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  private readonly api = inject(ProductServiceService);
  private readonly categoryApi = inject(CategoryService);

  readonly products = signal<IProduct[]>([]);
  readonly categories = signal<ICategory[]>([]);
  readonly loading = signal(true);
  readonly formError = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  productForm = {
    id: 0,
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    slug: '',
    price: 0,
    rate: 0,
    isAvailable: true,
    categoryId: 0
  };

  get editMode(): boolean {
    return this.productForm.id > 0;
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.api.getAdminProducts().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : res?.data;
        this.products.set(Array.isArray(list) ? list : []);
        this.loading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.loading.set(false);
      }
    });
  }

  loadCategories(): void {
    this.categoryApi.getAllCategories('en').subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : res?.data;
        this.categories.set(Array.isArray(list) ? list : []);
        if (this.categories().length > 0 && this.productForm.categoryId === 0) {
          this.productForm.categoryId = this.categories()[0].id;
        }
      },
      error: () => {
        this.categories.set([]);
      }
    });
  }

  saveProduct(): void {
    this.formError.set(null);
    this.success.set(null);

    if (!this.productForm.slug.trim() || !this.productForm.nameEn.trim() || !this.productForm.nameAr.trim()) {
      this.formError.set('Please fill slug and both translations.');
      return;
    }

    if (this.productForm.categoryId === 0) {
      this.formError.set('Please select a category.');
      return;
    }

    const translations = [
      { languageCode: 'en', name: this.productForm.nameEn.trim(), description: this.productForm.descriptionEn.trim() },
      { languageCode: 'ar', name: this.productForm.nameAr.trim(), description: this.productForm.descriptionAr.trim() }
    ];

    const data = new FormData();
    data.append('slug', this.productForm.slug.trim());
    data.append('price', this.productForm.price.toString());
    data.append('rate', this.productForm.rate.toString());
    data.append('isAvailable', String(this.productForm.isAvailable));
    data.append('categoryId', this.productForm.categoryId.toString());
    data.append('translationsJson', JSON.stringify(translations));

    const request = this.editMode
      ? this.api.updateProduct(this.productForm.id, data)
      : this.api.createProduct(data);

    request.subscribe({
      next: () => {
        this.success.set(this.editMode ? 'Product updated successfully.' : 'Product created successfully.');
        this.resetForm();
        this.loadProducts();
      },
      error: () => {
        this.formError.set('Something went wrong while saving the product.');
      }
    });
  }

  editProduct(item: IProduct): void {
    this.productForm = {
      id: item.id,
      nameEn: item.name || '',
      nameAr: '',
      descriptionEn: item.description || '',
      descriptionAr: '',
      slug: item.slug || '',
      price: item.price || 0,
      rate: item.rate || 0,
      isAvailable: item.isAvailable ?? true,
      categoryId: item.categoryId || this.categories()[0]?.id || 0
    };
    this.formError.set(null);
    this.success.set(null);
  }

  deleteProduct(id: number): void {
    if (!confirm('Delete this product? This action cannot be undone.')) {
      return;
    }
    this.api.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: () => {
        this.formError.set('Unable to delete product.');
      }
    });
  }

  resetForm(): void {
    this.productForm = {
      id: 0,
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      slug: '',
      price: 0,
      rate: 0,
      isAvailable: true,
      categoryId: this.categories()[0]?.id || 0
    };
    this.formError.set(null);
    this.success.set(null);
  }
}
