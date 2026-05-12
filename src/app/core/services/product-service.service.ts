import { environment } from './../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  private readonly http = inject(HttpClient);

  /** Get all client products */
  getClientProducts(lang: string = 'en'): Observable<unknown> {
    const url = `${environment.BaseUrl}/api/Products/client`;
    const params = new HttpParams().set('lang', lang);

    console.log('🔗 Requesting products from:', url, 'with lang:', lang);

    return this.http.get(url, { params }).pipe(
      tap((res) => console.log('✅ Products API Success:', res)),
      catchError((err) => {
        console.error('❌ Products API Error:', err);
        return throwError(() => err);
      })
    );
  }

  /** Get products by category ID */
  getProductsByCategory(categoryId: number, lang: string = 'en'): Observable<unknown> {
    const url = `${environment.BaseUrl}/api/Products`;
    const params = new HttpParams()
      .set('lang', lang)
      .set('categoryId', categoryId.toString());

    console.log('🔗 Requesting products for category:', categoryId, 'from:', url);

    return this.http.get(url, { params }).pipe(
      tap((res) => console.log('✅ Category Products API Success:', res)),
      catchError((err) => {
        console.error('❌ Category Products API Error:', err);
        return throwError(() => err);
      })
    );
  }

  getProductBySlug(slug: string): Observable<unknown> {
    return this.http.get(`${environment.BaseUrl}/api/Products/${encodeURIComponent(slug)}`);
  }

  /** Admin listing */
  getAdminProducts(): Observable<unknown> {
    return this.http.get(`${environment.BaseUrl}/api/Products/admin`);
  }

  createProduct(data: FormData): Observable<unknown> {
    return this.http.post(`${environment.BaseUrl}/api/Products/create`, data);
  }

  updateProduct(id: number, data: FormData): Observable<unknown> {
    return this.http.put(`${environment.BaseUrl}/api/Products/update/${id}`, data);
  }

  deleteProduct(id: number): Observable<unknown> {
    return this.http.delete(`${environment.BaseUrl}/api/Products/delete/${id}`);
  }
}

