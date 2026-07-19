/**
 * Los 3 roles del sistema (deben coincidir EXACTAMENTE con los nombres
 * sembrados en el backend: prisma/seed.ts -> tabla `roles`).
 */
export type UserRole = 'Administrador' | 'Editor' | 'Usuario';

/** Orden de "jerarquía" usado para calcular el rol principal cuando un
 * usuario tuviera más de un rol asignado (hoy el backend asigna solo uno,
 * pero el esquema permite varios a futuro). */
const JERARQUIA_ROLES: UserRole[] = ['Administrador', 'Editor', 'Usuario'];

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  activo: boolean;
  fechaRegistro: string;

  /** Todos los roles que tiene asignados el usuario (tal cual los manda el backend). */
  roles: UserRole[];
  /** Permisos granulares aplanados (ej. "usuarios.crear", "salas.editar"). */
  permisos: string[];

  /** Rol "principal" derivado de `roles`, útil para la UI (badges, redirecciones). */
  rol: UserRole;
}

/** Calcula el rol principal (el de mayor jerarquía) a partir de la lista de roles. */
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
