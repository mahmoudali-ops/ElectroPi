import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, TranslatedPipe],
  template: `
    <div class="wrap">
      <h1>{{ 'STORE.ADMIN_DASHBOARD' | t }}</h1>
      <p class="sub">{{ 'STORE.TAGLINE' | t }}</p>
      <div class="grid">
        <a routerLink="/admin/products" class="tile">{{ 'STORE.ADMIN_PRODUCTS' | t }}</a>
        <a routerLink="/admin/categories" class="tile">{{ 'STORE.ADMIN_CATEGORIES' | t }}</a>
        <a routerLink="/admin/orders" class="tile">{{ 'STORE.ADMIN_ORDERS' | t }}</a>
        <a routerLink="/admin/users" class="tile">Users</a>
      </div>
    </div>
  `,
  styles: [
    `
      .wrap {
        max-width: 960px;
        margin: 0 auto;
        padding: 100px 24px 48px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 1.5rem;
      }
      .sub {
        color: #64748b;
        margin: 0 0 28px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
      }
      .tile {
        display: block;
        padding: 22px;
        border-radius: 14px;
        border: 1px solid #e2e8f0;
        text-decoration: none;
        color: #0f172a;
        font-weight: 700;
        background: #fff;
      }
      .tile:hover {
        border-color: #2563eb;
        color: #2563eb;
      }
    `
  ]
})
export class AdminDashboardComponent {}
