import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const verifyemailGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.is_email_verified()) {
    return true;
  } else {
    router.navigate(['/email_verify']);
    return false;
  }
};
