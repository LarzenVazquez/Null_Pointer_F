import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@models/user.model';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  router.navigate(['/auth/login'], { queryParams: { redirect: state.url } });
  return false;
};

export const roleGuard = (...rolesPermitidos: UserRole[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated() && auth.hasAnyRole(...rolesPermitidos)) {
      return true;
    }

    router.navigate(['/']);
    return false;
  };
};

export function rutaInicioSegunRol(auth: AuthService): string {
  if (auth.hasAnyRole('Administrador', 'Editor')) return '/admin';
  return '/usuario';
}

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) return true;

  router.navigate([rutaInicioSegunRol(auth)]);
  return false;
};
