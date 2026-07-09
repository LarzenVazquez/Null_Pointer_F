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
}
