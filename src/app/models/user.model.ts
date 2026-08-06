export type UserRole = 'Administrador' | 'Editor' | 'Usuario';

const JERARQUIA_ROLES: UserRole[] = ['Administrador', 'Editor', 'Usuario'];

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  activo: boolean;
  fechaRegistro: string;

  roles: UserRole[];

  permisos: string[];

  rol: UserRole;
}

export function rolPrincipal(roles: UserRole[]): UserRole {
  for (const r of JERARQUIA_ROLES) {
    if (roles.includes(r)) return r;
  }
  return 'Usuario';
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  telefono?: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
