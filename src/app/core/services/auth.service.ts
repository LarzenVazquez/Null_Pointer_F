import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import {
  AuthCredentials,
  AuthResponse,
  RegisterPayload,
  User,
  UserRole,
  rolPrincipal,
} from '@models/user.model';

// Clave de localStorage donde vive el access token (JWT de corta duración).
// El interceptor (auth.interceptor.ts) lo lee de aquí para adjuntarlo
// como header `Authorization: Bearer <token>` en cada petición.
export const AUTH_TOKEN_KEY = 'np_auth_token';
const AUTH_USER_KEY = 'np_auth_user';

const API_URL = `${environment.apiUrl}/auth`;
const USUARIOS_URL = `${environment.apiUrl}/usuarios`;

// --- Formas "crudas" que devuelve el backend (ver src/services/*.service.ts) ---
interface UsuarioDTO {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  activo: boolean;
  createdAt: string;
  roles?: UserRole[];
  permisos?: string[];
}

interface LoginResponse {
  ok: boolean;
  usuario: UsuarioDTO;
  accessToken: string;
}

interface RegistroResponse {
  ok: boolean;
  mensaje: string;
  usuario: UsuarioDTO;
}

function mapearUsuario(dto: UsuarioDTO): User {
  const roles = dto.roles ?? [];
  return {
    id: dto.id,
    nombre: dto.nombre,
    email: dto.email,
    telefono: dto.telefono,
    activo: dto.activo,
    fechaRegistro: dto.createdAt,
    roles,
    permisos: dto.permisos ?? [],
    rol: rolPrincipal(roles),
  };
}

/**
 * AuthService — implementación real conectada al backend.
 *
 * Estrategia de sesión:
 *  - El access token (JWT, vive ~15 min) se guarda en localStorage y viaja
 *    en el header Authorization en cada petición (ver auth.interceptor.ts).
 *  - El refresh token vive en una cookie httpOnly que el navegador maneja
 *    solo; nunca es visible desde este código (por diseño, mitiga XSS).
 *  - Al arrancar la app, si hay una sesión previa cacheada, se intenta
 *    refrescar en segundo plano contra /auth/refresh para validar que la
 *    cookie siga viva y obtener un access token fresco.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private currentUserSig = signal<User | null>(this.loadUserFromStorage());

  readonly currentUser = this.currentUserSig.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSig() !== null);
  readonly isAdmin = computed(() => this.hasRole('Administrador'));
  readonly isEditor = computed(() => this.hasRole('Editor'));

  constructor() {
    if (this.isBrowser) {
      // Intento silencioso de restaurar sesión al recargar la página.
      this.refrescarSesion().catch(() => {
        // La cookie de refresh no existe o expiró: se limpia cualquier
        // sesión cacheada para no mostrar datos obsoletos.
        this.limpiarSesionLocal();
      });
    }
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${API_URL}/login`, credentials, {
        withCredentials: true, // necesario para recibir la cookie de refresh
      }),
    );

    const user = mapearUsuario(res.usuario);
    this.persistSession(user, res.accessToken);
    return { user, token: res.accessToken };
  }

  /**
   * Registra al usuario (con rol "Usuario" por defecto en el backend) y
   * luego inicia sesión automáticamente para mantener la UX que ya tenía
   * la app (el registro deja al usuario logueado).
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await firstValueFrom(
      this.http.post<RegistroResponse>(`${API_URL}/registro`, payload),
    );

    return this.login({ email: payload.email, password: payload.password });
  }

  recoverPassword(email: string): Promise<{ sent: boolean }> {
    // TODO(backend): implementar envío real de correo de recuperación.
    // Por ahora, igual que antes, siempre "resuelve" sin revelar si el
    // correo existe (buena práctica de seguridad).
    return Promise.resolve({ sent: true });
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${API_URL}/logout`, {}, { withCredentials: true }),
      );
    } finally {
      this.limpiarSesionLocal();
    }
  }

  async logoutTodosLosDispositivos(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${API_URL}/logout-todos`, {}));
    } finally {
      this.limpiarSesionLocal();
    }
  }

  /** true si el usuario tiene ese rol asignado (soporta el modelo N:M del backend). */
  hasRole(role: UserRole): boolean {
    return this.currentUserSig()?.roles.includes(role) ?? false;
  }

  /** true si el usuario tiene alguno de los roles indicados. */
  hasAnyRole(...roles: UserRole[]): boolean {
    const actuales = this.currentUserSig()?.roles ?? [];
    return roles.some((r) => actuales.includes(r));
  }

  /** true si el usuario tiene el permiso granular indicado (ej. "usuarios.crear"). */
  hasPermission(permiso: string): boolean {
    return this.currentUserSig()?.permisos.includes(permiso) ?? false;
  }

  async updateProfile(
    cambios: Partial<Pick<User, 'nombre' | 'telefono'>>,
  ): Promise<void> {
    const res = await firstValueFrom(
      this.http.put<{ ok: boolean; usuario: UsuarioDTO }>(
        `${API_URL}/perfil`,
        cambios,
      ),
    );
    const actualizado = mapearUsuario(res.usuario);
    this.currentUserSig.set(actualizado);
    if (this.isBrowser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(actualizado));
    }
  }

  /** Panel de Admin/Editor: lista todos los usuarios registrados. Requiere permiso "usuarios.ver". */
  async getAllUsers(): Promise<User[]> {
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; usuarios: UsuarioDTO[] }>(USUARIOS_URL),
    );
    return res.usuarios.map(mapearUsuario);
  }

  /** Panel de Admin: cambia el rol de un usuario. Requiere rol "Administrador" en el backend. */
  async updateUserRole(userId: number, rol: UserRole): Promise<User> {
    const res = await firstValueFrom(
      this.http.patch<{ ok: boolean; usuario: UsuarioDTO }>(
        `${USUARIOS_URL}/${userId}/rol`,
        { rol },
      ),
    );
    const actualizado = mapearUsuario(res.usuario);

    // Si el usuario editado es el que tiene la sesión activa, refresca su signal.
    const actual = this.currentUserSig();
    if (actual?.id === userId) {
      this.currentUserSig.set(actualizado);
      if (this.isBrowser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(actualizado));
      }
    }

    return actualizado;
  }

  // ---------------------------------------------------------------------
  // Internos
  // ---------------------------------------------------------------------

  /** Intercambia la cookie de refresh por un access token nuevo + el usuario actualizado. */
  private async refrescarSesion(): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(
        `${API_URL}/refresh`,
        {},
        { withCredentials: true },
      ),
    );
    const user = mapearUsuario(res.usuario);
    this.persistSession(user, res.accessToken);
  }

  private limpiarSesionLocal(): void {
    this.currentUserSig.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }

  private loadUserFromStorage(): User | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private persistSession(user: User, token: string): void {
    this.currentUserSig.set(user);
    if (this.isBrowser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  }
}
