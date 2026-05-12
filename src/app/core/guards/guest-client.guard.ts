import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

/** If already logged in, skip client login page. */
export const guestClientGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map((ok) => {
      if (!ok) return true;
      const role = localStorage.getItem('userRole');
      router.navigateByUrl(role === 'Admin' ? '/admin/dashboard' : '/store');
      return false;
    }),
    catchError(() => of(true))
  );
};
