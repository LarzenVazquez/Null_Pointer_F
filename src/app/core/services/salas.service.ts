import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Sala } from '@models/sala.model';

const SALAS_OVERRIDES_KEY = 'np_salas_overrides';

type SalaOverride = Partial<Pick<Sala, 'precio' | 'badgeLabel' | 'descripcion'>>;

/**
 * Catálogo único de salas. Antes vivía duplicado (con datos ligeramente
 * distintos) dentro de SalasComponent y ReservasComponent; ahora ambos,
 * más el flujo de "nueva reserva" del panel de usuario, leen de aquí.
 *
 * El panel de Admin puede editar precio/descripcion/badge; esos cambios
 * se guardan como "overrides" en localStorage y se combinan con el
 * catálogo base al leer.
 *
 * TODO(API): reemplazar el arreglo estático por this.http.get<Sala[]>('/api/salas').
 */
@Injectable({ providedIn: 'root' })
export class SalasService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private salasBase: Sala[] = [
    {
      id: 'A',
      name: 'Sala A',
      precio: 150,
      capacidad: 6,
      m2: 40,
      badge: 'popular',
      badgeLabel: 'Más popular',
      featured: true,
      descripcion:
        'Nuestra sala premium con cabina de control independiente. Ideal para bandas completas y sesiones de grabacion de alta exigencia.',
      equipo: [
        'Bateria Pearl Export Pro + Zildjian A',
        'Monitoreo independiente por zona',
        'Cabina de control',
        'Marshall DSL40CR + Ampeg BA-210',
      ],
    },
    {
      id: 'B',
      name: 'Sala B',
      precio: 110,
      capacidad: 4,
      m2: 28,
      badge: 'pro',
      badgeLabel: 'PRO',
      featured: false,
      descripcion:
        'Sala profesional con mesa de mezcla digital de 32 canales. Perfecta para bandas de 4 elementos que buscan sonido de estudio.',
      equipo: [
        'Bateria Mapex Saturn',
        'Mesa Behringer X32 (32ch)',
        'PA JBL profesional',
        'Amplificadores Marshall + Ampeg',
      ],
    },
    {
      id: 'C',
      name: 'Sala C',
      precio: 80,
      capacidad: 3,
      m2: 18,
      badge: 'std',
      badgeLabel: 'STD',
      featured: false,
      descripcion:
        'Sala estandar ideal para trios, duos o solistas. El mejor costo-beneficio para ensayos regulares.',
      equipo: [
        'Bateria Pearl Roadshow',
        'Amplificadores basicos',
        'Monitor de retorno',
        'Ideal para grupos de hasta 3',
      ],
    },
  ];

  getSalas(): Sala[] {
    const overrides = this.getOverrides();
    return this.salasBase.map((s) => ({ ...s, ...overrides[s.id] }));
  }

  getSalaById(id: string): Sala | undefined {
    return this.getSalas().find((s) => s.id === id);
  }

  /** Usado por el panel de Admin. */
  updateSala(id: string, cambios: SalaOverride): void {
    const overrides = this.getOverrides();
    overrides[id] = { ...overrides[id], ...cambios };
    this.saveOverrides(overrides);
  }

  private getOverrides(): Record<string, SalaOverride> {
    if (!this.isBrowser) return {};
    try {
      const raw = localStorage.getItem(SALAS_OVERRIDES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveOverrides(overrides: Record<string, SalaOverride>): void {
    if (!this.isBrowser) return;
    localStorage.setItem(SALAS_OVERRIDES_KEY, JSON.stringify(overrides));
  }
}
