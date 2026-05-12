import { environment } from './../environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);

  // ==================================================
  // CREATE CATEGORY
  // ==================================================
  createCategory(data: FormData): Observable<any> {
    return this.http.post(`${environment.BaseUrl}/api/Catgory/create`, data);
  }

  // ==================================================
  // UPDATE CATEGORY
  // ==================================================
  updateCategory(id: number, data: FormData): Observable<any> {
    return this.http.put(`${environment.BaseUrl}/api/Catgory/update/${id}`, data);
  }

  // ==================================================
  // DELETE CATEGORY
  // ==================================================
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${environment.BaseUrl}/api/Catgory/delete/${id}`);
  }

  // ==================================================
  // GET ALL CATEGORIES (CLIENT)
  // ==================================================
  getAllCategories(lang: string = 'en'): Observable<any> {
    return this.http.get(
      `${environment.BaseUrl}/api/Catgory/client?lang=${lang}`
    );
  }

  // ==================================================
  // GET CATEGORY BY ID
  // ==================================================
  getCategoryById(id: number): Observable<any> {
    return this.http.get(`${environment.BaseUrl}/api/Catgory/${id}`);
  }
}