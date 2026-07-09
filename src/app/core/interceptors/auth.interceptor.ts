import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { AUTH_TOKEN_KEY } from '@core/services/auth.service';

/**
 * Adjunta el token de sesión (mock) a cada petición saliente.
 * Hoy no hay backend real, pero cuando lo haya, este interceptor ya
 * queda listo: solo hace falta que AuthService guarde un token real
 * en AUTH_TOKEN_KEY tras el login/registro.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  const token = isBrowser ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

  if (!token) return next(req);

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
