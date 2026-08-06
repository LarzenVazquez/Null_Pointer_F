export interface Sala {
  id: string;
  name: string;
  precio: number;
  capacidad: number;
  m2: number;
  badge: 'popular' | 'pro' | 'std';
  badgeLabel: string;
  featured: boolean;
  descripcion: string;
  equipo: string[];
  /** Ruta/link de la imagen de la sala, gestionada por el backend (archivo o URL externa). */
  imagenUrl?: string | null;
}

/** Datos editables de una sala desde el panel de administración (sin id). */
export interface SalaFormData {
  nombre: string;
  precio: number;
  capacidad: number;
  m2: number;
  badge: 'popular' | 'pro' | 'std';
  badgeLabel: string;
  featured: boolean;
  descripcion: string;
  equipo: string[];
  imagenUrl?: string;
}
