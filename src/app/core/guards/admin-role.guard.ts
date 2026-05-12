import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminRoleGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = localStorage.getItem('userRole');
  if (role === 'Admin') return true;
  router.navigate(['/store']);
  return false;
};
