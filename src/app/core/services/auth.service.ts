import {
  Injectable,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { CriptoService } from '@core/services/cripto.service';
import {
  AuthCredentials,
  AuthResponse,
  RegisterPayload,
  User,
  UserRole,
  rolPrincipal,
} from '@models/user.model';

export const AUTH_TOKEN_KEY = 'np_auth_token';
const AUTH_USER_KEY = 'np_auth_user';

const API_URL = `${environment.apiUrl}/auth`;
const USUARIOS_URL = `${environment.apiUrl}/usuarios`;

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private cripto = inject(CriptoService);

  private currentUserSig = signal<User | null>(this.loadUserFromStorage());

  readonly currentUser = this.currentUserSig.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSig() !== null);
  readonly isAdmin = computed(() => this.hasRole('Administrador'));
  readonly isEditor = computed(() => this.hasRole('Editor'));

  constructor() {
    if (this.isBrowser) {
      this.refrescarSesion().catch(() => {
        this.limpiarSesionLocal();
      });
    }
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const payloadCifrado = await this.cripto.cifrar(credentials);

    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${API_URL}/login`, payloadCifrado, {
        withCredentials: true,
      }),
    );

    const user = mapearUsuario(res.usuario);
    this.persistSession(user, res.accessToken);
    return { user, token: res.accessToken };
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await firstValueFrom(
      this.http.post<RegistroResponse>(`${API_URL}/registro`, payload),
    );

    return this.login({ email: payload.email, password: payload.password });
  }

  recoverPassword(email: string): Promise<{ sent: boolean }> {
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

  hasRole(role: UserRole): boolean {
    return this.currentUserSig()?.roles.includes(role) ?? false;
  }

  hasAnyRole(...roles: UserRole[]): boolean {
    const actuales = this.currentUserSig()?.roles ?? [];
    return roles.some((r) => actuales.includes(r));
  }

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

  async getAllUsers(): Promise<User[]> {
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; usuarios: UsuarioDTO[] }>(USUARIOS_URL),
    );
    return res.usuarios.map(mapearUsuario);
  }

  async updateUserRole(userId: number, rol: UserRole): Promise<User> {
    const res = await firstValueFrom(
      this.http.patch<{ ok: boolean; usuario: UsuarioDTO }>(
        `${USUARIOS_URL}/${userId}/rol`,
        { rol },
      ),
    );
    const actualizado = mapearUsuario(res.usuario);

    const actual = this.currentUserSig();
    if (actual?.id === userId) {
      this.currentUserSig.set(actualizado);
      if (this.isBrowser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(actualizado));
      }
    }

    return actualizado;
  }

  // --- NUEVA FUNCIÓN PARA LA BAJA LÓGICA ---
  async cambiarEstadoUsuario(userId: number, activo: boolean): Promise<User> {
    const res = await firstValueFrom(
      this.http.patch<{ ok: boolean; usuario: UsuarioDTO }>(
        `${USUARIOS_URL}/${userId}/estado`,
        { activo },
      ),
    );
    const actualizado = mapearUsuario(res.usuario);

    const actual = this.currentUserSig();
    if (actual?.id === userId) {
      this.currentUserSig.set(actualizado);
      if (this.isBrowser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(actualizado));
      }
    }

    return actualizado;
  }
  // -----------------------------------------

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
