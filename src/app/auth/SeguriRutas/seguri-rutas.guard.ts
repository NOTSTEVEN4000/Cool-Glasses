import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../../core/services/seguridad/auth-service.service';
import { inject } from '@angular/core';

export const seguriRutasGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};
