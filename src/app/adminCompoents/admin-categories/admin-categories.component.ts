import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category-service.service';
import { LanguageService } from '../../core/services/language.service';
import { ICategory } from '../../core/interfaces/iproduct';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {
  private readonly api = inject(CategoryService);
  private readonly lang = inject(LanguageService);

  readonly categories = signal<ICategory[]>([]);
  readonly loading = signal(true);
  readonly formError = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  categoryForm = {
    id: 0,
    slug: '',
    nameEn: '',
    nameAr: ''
  };

  get editMode(): boolean {
    return this.categoryForm.id > 0;
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.api.getAllCategories(this.lang.currentLangValue).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : res?.data;
        this.categories.set(Array.isArray(list) ? list : []);
        this.loading.set(false);
      },
      error: () => {
        this.categories.set([]);
        this.loading.set(false);
      }
    });
  }

  saveCategory(): void {
    this.formError.set(null);
    this.success.set(null);

    if (!this.categoryForm.slug.trim() || !this.categoryForm.nameEn.trim() || !this.categoryForm.nameAr.trim()) {
      this.formError.set('Please fill the slug and both translations.');
      return;
    }

    const data = new FormData();
    data.append('slug', this.categoryForm.slug.trim());
    data.append(
      'translationsJson',
      JSON.stringify([
        { languageCode: 'en', name: this.categoryForm.nameEn.trim() },
        { languageCode: 'ar', name: this.categoryForm.nameAr.trim() }
      ])
    );

    const request = this.editMode
      ? this.api.updateCategory(this.categoryForm.id, data)
      : this.api.createCategory(data);

    request.subscribe({
      next: () => {
        this.success.set(this.editMode ? 'Category updated successfully.' : 'Category created successfully.');
        this.resetForm();
        this.loadCategories();
      },
      error: () => {
        this.formError.set('Unable to save category.');
      }
    });
  }

  editCategory(category: ICategory): void {
    this.categoryForm = {
      id: category.id,
      slug: category.slug,
      nameEn: category.translations?.find((t) => t.languageCode === 'en')?.name || '',
      nameAr: category.translations?.find((t) => t.languageCode === 'ar')?.name || ''
    };
    this.formError.set(null);
    this.success.set(null);
  }

  deleteCategory(id: number): void {
    if (!confirm('Delete this category?')) {
      return;
    }
    this.api.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: () => {
        this.formError.set('Unable to delete category.');
      }
    });
  }

  resetForm(): void {
    this.categoryForm = {
      id: 0,
      slug: '',
      nameEn: '',
      nameAr: ''
    };
    this.formError.set(null);
    this.success.set(null);
  }

  translationName(category: ICategory, language: 'en' | 'ar'): string {
    return category.translations?.find((item) => item.languageCode === language)?.name ?? '—';
  }

  label(c: ICategory): string {
    const code = this.lang.currentLangValue;
    return c.translations?.find((t) => t.languageCode === code)?.name ?? c.slug;
  }
}
