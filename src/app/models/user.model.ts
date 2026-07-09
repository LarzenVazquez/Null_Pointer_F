export type UserRole = 'admin' | 'usuario';

export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: UserRole;
  fechaRegistro: string;
  avatarUrl?: string;
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
