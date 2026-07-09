import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  AuthCredentials,
  AuthResponse,
  RegisterPayload,
  User,
  UserRole,
} from '@models/user.model';

// Claves de almacenamiento local (persistencia mock de la sesión).
export const AUTH_TOKEN_KEY = 'np_auth_token';
const AUTH_USER_KEY = 'np_auth_user';
const AUTH_USERS_DB_KEY = 'np_auth_users_db';

type StoredUser = User & { password: string };

/**
 * AuthService — implementación MOCK (sin backend real).
 *
 * Toda la "base de datos" de usuarios vive en localStorage y las llamadas
 * simulan latencia de red con setTimeout. Las firmas de los métodos
 * (Promise<AuthResponse>, etc.) ya están pensadas para conectarse a una
 * API real más adelante: basta con reemplazar el cuerpo de login(),
 * register() y recoverPassword() por llamadas a HttpClient, sin tocar
 * a los componentes que consumen este servicio.
 *
 * TODO(API): sustituir el bloque "MOCK DB" por peticiones HTTP reales,
 * p.ej. this.http.post<AuthResponse>('/api/auth/login', credentials).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private currentUserSig = signal<User | null>(this.loadUserFromStorage());

  readonly currentUser = this.currentUserSig.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSig() !== null);
  readonly isAdmin = computed(() => this.currentUserSig()?.rol === 'admin');

  constructor() {
    this.seedMockUsers();
  }

  login(credentials: AuthCredentials): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = this.getUsersDb();
        const found = db.find(
          (u) => u.email.toLowerCase() === credentials.email.trim().toLowerCase(),
        );

        if (!found || found.password !== credentials.password) {
          reject(new Error('Correo o contraseña incorrectos.'));
          return;
        }

        const { password, ...user } = found;
        const token = this.generateMockToken(user);
        this.persistSession(user, token);
        resolve({ user, token });
      }, 550);
    });
  }

  register(payload: RegisterPayload): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = this.getUsersDb();
        const yaExiste = db.some(
          (u) => u.email.toLowerCase() === payload.email.trim().toLowerCase(),
        );

        if (yaExiste) {
          reject(new Error('Ya existe una cuenta registrada con ese correo.'));
          return;
        }

        const nuevo: StoredUser = {
          id: this.generateId(),
          nombre: payload.nombre.trim(),
          email: payload.email.trim().toLowerCase(),
          telefono: payload.telefono?.trim() || undefined,
          rol: 'usuario',
          fechaRegistro: new Date().toISOString(),
          password: payload.password,
        };

        this.saveUsersDb([...db, nuevo]);

        const { password, ...user } = nuevo;
        const token = this.generateMockToken(user);
        this.persistSession(user, token);
        resolve({ user, token });
      }, 650);
    });
  }

  recoverPassword(email: string): Promise<{ sent: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock: no se envía correo real. Siempre "resuelve" para no revelar
        // si el correo existe o no en la base de datos (buena práctica de seguridad).
        resolve({ sent: true });
      }, 500);
    });
  }

  logout(): void {
    this.currentUserSig.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSig()?.rol === role;
  }

  updateProfile(cambios: Partial<Pick<User, 'nombre' | 'telefono'>>): void {
    const actual = this.currentUserSig();
    if (!actual) return;

    const actualizado: User = { ...actual, ...cambios };
    this.currentUserSig.set(actualizado);

    if (this.isBrowser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(actualizado));
      const db = this.getUsersDb().map((u) =>
        u.id === actualizado.id ? { ...u, ...cambios } : u,
      );
      this.saveUsersDb(db);
    }
  }

  /** Usado por el panel de Admin: lista de todos los usuarios registrados (sin password). */
  getAllUsers(): User[] {
    return this.getUsersDb()
      .map(({ password, ...user }) => user)
      .sort((a, b) => (a.fechaRegistro < b.fechaRegistro ? 1 : -1));
  }

  /** Usado por el panel de Admin: cambia el rol de un usuario. */
  updateUserRole(userId: string, rol: UserRole): void {
    const db = this.getUsersDb().map((u) => (u.id === userId ? { ...u, rol } : u));
    this.saveUsersDb(db);

    // Si el usuario editado es el que tiene la sesión activa, refresca su signal.
    const actual = this.currentUserSig();
    if (actual?.id === userId) {
      const actualizado = { ...actual, rol };
      this.currentUserSig.set(actualizado);
      if (this.isBrowser) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(actualizado));
    }
  }

  // ---------------------------------------------------------------------
  // MOCK DB — reemplazar por HttpClient cuando exista backend real.
  // ---------------------------------------------------------------------

  private seedMockUsers(): void {
    if (!this.isBrowser) return;
    const existentes = this.getUsersDb();
    if (existentes.length > 0) return;

    const semillas: StoredUser[] = [
      {
        id: 'admin-001',
        nombre: 'Admin Null Pointer',
        email: 'admin@nullpointer.mx',
        rol: 'admin',
        fechaRegistro: new Date().toISOString(),
        password: 'admin123',
      },
      {
        id: 'user-001',
        nombre: 'Cliente Demo',
        email: 'cliente@nullpointer.mx',
        rol: 'usuario',
        fechaRegistro: new Date().toISOString(),
        password: 'cliente123',
      },
    ];

    this.saveUsersDb(semillas);
  }

  private getUsersDb(): StoredUser[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(AUTH_USERS_DB_KEY);
      return raw ? (JSON.parse(raw) as StoredUser[]) : [];
    } catch {
      return [];
    }
  }

  private saveUsersDb(db: StoredUser[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(AUTH_USERS_DB_KEY, JSON.stringify(db));
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

  private generateId(): string {
    return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private generateMockToken(user: User): string {
    // Mock de JWT: base64 con payload mínimo. NO usar en producción.
    return btoa(`${user.id}.${user.rol}.${Date.now()}`);
  }
}
