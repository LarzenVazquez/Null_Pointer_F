import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AUTH_TOKEN_KEY, SesionService } from '@core/services/sesion.service';

/** Endpoints de autenticación: un 401 aquí NO debe disparar una renovación. */
const RUTAS_SIN_RENOVACION = ['/auth/login', '/auth/refresh', '/auth/logout', '/auth/registro'];

function conToken(req: HttpRequest<unknown>, token: string) {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

/**
 * 1. Agrega el access token (15 min) a cada petición.
 * 2. Si el backend responde 401, renueva la sesión con la cookie de refresh
 *    y repite la petición UNA vez con el token nuevo.
 * 3. Si la renovación falla, la sesión terminó: manda al login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return next(req);

  const sesion = inject(SesionService);
  const router = inject(Router);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) return next(req);

  return next(conToken(req, token)).pipe(
    catchError((err: unknown) => {
      const esRutaDeAuth = RUTAS_SIN_RENOVACION.some((r) => req.url.includes(r));
      if (!(err instanceof HttpErrorResponse) || err.status !== 401 || esRutaDeAuth) {
        return throwError(() => err);
      }

      return from(sesion.renovar()).pipe(
        catchError(() => {
          router.navigate(['/auth/login'], {
            queryParams: { redirect: router.url, expirada: 1 },
          });
          return throwError(() => err);
        }),
        switchMap((res) => next(conToken(req, res.accessToken))),
      );
    }),
  );
};
