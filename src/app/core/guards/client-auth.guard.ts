import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

/** Requires authenticated non-admin (store area). */
export const clientAuthGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map((ok) => {
      if (!ok) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      if (localStorage.getItem('userRole') === 'Admin') {
        router.navigate(['/admin/dashboard']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};
