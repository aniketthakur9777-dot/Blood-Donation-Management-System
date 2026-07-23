import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isAdmin()) {
    return true;
  }

  if (auth.isLoggedIn()) {
    // If logged in as donor, redirect to donor dashboard
    router.navigate(['/donor/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
