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
 * Protege rutas que requieren alguno de los roles indicados.
 * Uso: canActivate: [authGuard, roleGuard('Administrador')]
 *      canActivate: [authGuard, roleGuard('Administrador', 'Editor')]
 *
 * Este es un control de acceso "de cortesía" en el cliente (evita que la
 * UI se muestre a quien no debería verla); el control real y no evadible
 * lo hace el backend en cada endpoint protegido con requireRole/requirePermission.
 */
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

/** Calcula a dónde debe ir cada rol tras iniciar sesión / si intenta ver login estando ya autenticado. */
export function rutaInicioSegunRol(auth: AuthService): string {
  if (auth.hasAnyRole('Administrador', 'Editor')) return '/admin';
  return '/usuario';
}

/**
 * Evita que un usuario ya autenticado vuelva a ver login/registro.
 * Lo redirige directo a su panel según su rol.
 */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) return true;

  router.navigate([rutaInicioSegunRol(auth)]);
  return false;
};
