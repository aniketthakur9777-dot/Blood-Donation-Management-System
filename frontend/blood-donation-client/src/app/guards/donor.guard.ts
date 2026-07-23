import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const donorGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isLoggedIn() && !auth.isAdmin()) {
    return true;
  }

  if (auth.isLoggedIn()) {
    // If logged in as admin, redirect to admin dashboard
    router.navigate(['/admin/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
