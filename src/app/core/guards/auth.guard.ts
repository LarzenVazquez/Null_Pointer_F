import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@models/user.model';

/**
 * Protege rutas que requieren sesión iniciada (cualquier rol).
 * Si no hay sesión, redirige a /auth/login conservando la URL destino
 * en el query param `redirect` para volver ahí después de iniciar sesión.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  router.navigate(['/auth/login'], { queryParams: { redirect: state.url } });
  return false;
};

/**
 * Protege rutas que requieren un rol específico (p.ej. 'admin').
 * Uso: canActivate: [authGuard, roleGuard('admin')]
 */
export const roleGuard = (rolRequerido: UserRole): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated() && auth.hasRole(rolRequerido)) return true;

    router.navigate(['/']);
    return false;
  };
};

/**
 * Evita que un usuario ya autenticado vuelva a ver login/registro.
 * Lo redirige directo a su panel según su rol.
 */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) return true;

  router.navigate([auth.isAdmin() ? '/admin' : '/usuario']);
  return false;
};
