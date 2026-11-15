import { Injectable, inject } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Subject, firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { UserRole } from '@models/user.model';

export const AUTH_TOKEN_KEY = 'np_auth_token';

/** Respuesta de POST /api/auth/refresh. */
export interface RefreshResponse {
  ok: boolean;
  accessToken: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    activo: boolean;
    createdAt: string;
    roles?: UserRole[];
    permisos?: string[];
  };
}

/**
 * Renueva el access token con la cookie httpOnly de refresh.
 *
 * - Usa HttpBackend (un HttpClient SIN interceptores) para que el interceptor pueda
 *   llamarlo sin dependencia circular ni bucles de 401.
 * - Es "single-flight": si varias peticiones reciben 401 al mismo tiempo, todas esperan
 *   la MISMA renovación. Esto importa porque el backend rota el refresh token: dos
 *   renovaciones en paralelo invalidarían la sesión.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private http = new HttpClient(inject(HttpBackend));
  private enCurso: Promise<RefreshResponse> | null = null;

  /** Se emite cada vez que la sesión se renueva (AuthService actualiza el usuario). */
  readonly renovada$ = new Subject<RefreshResponse>();
  /** Se emite cuando la sesión ya no se puede renovar (AuthService cierra la sesión local). */
  readonly expirada$ = new Subject<void>();

  renovar(): Promise<RefreshResponse> {
    if (!this.enCurso) {
      this.enCurso = firstValueFrom(
        this.http.post<RefreshResponse>(
          `${environment.apiUrl}/auth/refresh`,
          {},
          { withCredentials: true },
        ),
      )
        .then((res) => {
          localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken);
          this.renovada$.next(res);
          return res;
        })
        .catch((err) => {
          this.expirada$.next();
          throw err;
        })
        .finally(() => {
          this.enCurso = null;
        });
    }
    return this.enCurso;
  }
}
