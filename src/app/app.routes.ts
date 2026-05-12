import { Routes } from '@angular/router';
import { authGuardGuard } from './core/guards/auth-guard.guard';
import { logedGuard } from './core/guards/loged.guard';
import { clientAuthGuard } from './core/guards/client-auth.guard';
import { guestClientGuard } from './core/guards/guest-client.guard';
import { adminRoleGuard } from './core/guards/admin-role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/client-layout/client-layout.component').then((m) => m.ClientLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'login',
        loadComponent: () => import('./adminCompoents/login/login.component').then((m) => m.LoginComponent),
        canActivate: [guestClientGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./adminCompoents/register/register.component').then((m) => m.RegisterComponent),
        canActivate: [guestClientGuard],
        title: 'Register'
      },
      {
        path: 'store',
        loadComponent: () =>
          import('./clientComponents/store/shop-home/shop-home.component').then((m) => m.ShopHomeComponent),
        canActivate: [clientAuthGuard]
      },
      {
        path: 'product/:slug',
        loadComponent: () =>
          import('./clientComponents/store/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent
          ),
        canActivate: [clientAuthGuard]
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./clientComponents/store/cart-page/cart-page.component').then((m) => m.CartPageComponent),
        canActivate: [clientAuthGuard]
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./clientComponents/store/checkout-page/checkout-page.component').then(
            (m) => m.CheckoutPageComponent
          ),
        canActivate: [clientAuthGuard]
      },
      {
        path: 'checkout/return',
        loadComponent: () =>
          import('./clientComponents/store/checkout-return/checkout-return.component').then(
            (m) => m.CheckoutReturnComponent
          ),
        canActivate: [clientAuthGuard]
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./clientComponents/store/orders-list/orders-list.component').then((m) => m.OrdersListComponent),
        canActivate: [clientAuthGuard]
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./clientComponents/store/order-detail/order-detail.component').then((m) => m.OrderDetailComponent),
        canActivate: [clientAuthGuard]
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: 'login', loadComponent: () => import('./adminCompoents/login/login.component').then((m) => m.LoginComponent), canActivate: [logedGuard], title: 'Login' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./adminCompoents/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
        canActivate: [authGuardGuard, adminRoleGuard],
        title: 'Admin Dashboard'
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./adminCompoents/admin-products/admin-products.component').then((m) => m.AdminProductsComponent),
        canActivate: [authGuardGuard, adminRoleGuard],
        title: 'Products'
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./adminCompoents/admin-categories/admin-categories.component').then(
            (m) => m.AdminCategoriesComponent
          ),
        canActivate: [authGuardGuard, adminRoleGuard],
        title: 'Categories'
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./adminCompoents/admin-orders/admin-orders.component').then((m) => m.AdminOrdersComponent),
        canActivate: [authGuardGuard, adminRoleGuard],
        title: 'Orders'
      },
      {
        path: 'users',
        loadComponent: () => import('./adminCompoents/users/users.component').then((m) => m.UsersComponent),
        canActivate: [authGuardGuard, adminRoleGuard],
        title: 'Users'
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: '**', redirectTo: 'dashboard' }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./clientComponents/notfound/notfound.component').then((m) => m.NotfoundComponent),
    title: 'Not Found Page'
  }
];
