import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../../core/services/seguridad/auth-service.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const seguriAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  const role = authService.getUserRole();
  if (role === 'administrador') {
    return true;
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Acceso Denegado',
      text: 'No tienes acceso a esta ruta.',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#d33'
    }).then(() => {
      router.navigate(['/']);
    });
    return false;
  }
};
