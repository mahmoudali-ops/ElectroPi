import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const logedGuard: CanActivateFn = (route, state) => { const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map(isAuth => {
      if (isAuth) {
        const role = localStorage.getItem('userRole');
        router.navigate([role === 'Admin' ? '/admin/dashboard' : '/store']);
        return false;
      }
      return true; // مش مسجل دخول → يسمح له بالوصول
    }),
    // لو فيه error اعتبره مش مسجل دخول
    catchError(() => of(true))
  );
};
