// src/app/services/evento-calendario.service.ts
import { Injectable, signal, computed } from '@angular/core';

export type EventoTipo =
  | 'default'
  | 'navidad'
  | 'anio_nuevo'
  | 'dia_muertos'
  | 'halloween'
  | 'san_valentin';

export interface EventoCalendario {
  tipo: EventoTipo;
  nombre: string;
  banner: string;
  descripcion: string;
  accentColor: string;
  accent2: string;
  bgColor: string;
  surfaceColor: string;
  emoji: string;
  particles: string[];
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

@Injectable({ providedIn: 'root' })
export class EventoCalendarioService {
  private eventos: Record<EventoTipo, EventoCalendario> = {
    navidad: {
      tipo: 'navidad',
      nombre: 'Navidad',
      banner:
        '🎄 Oferta Navideña — 20% off en ensayos del 20 al 31 de diciembre',
      descripcion: 'Toca villancicos en nuestras salas esta temporada.',
      accentColor: '#00C853',
      accent2: '#ff0000',
      bgColor: '#001a00',
      surfaceColor: '#003300',
      emoji: '🎄',
      particles: ['🎄', '⭐', '🎅', '🦌', '🎁', '❄️'],
      startMonth: 12,
      startDay: 20,
      endMonth: 12,
      endDay: 31,
    },
    anio_nuevo: {
      tipo: 'anio_nuevo',
      nombre: 'Año Nuevo',
      banner: '🥂 Año Nuevo — ¡Estrena el año tocando con tu banda!',
      descripcion: 'Empieza el año con el pie derecho... y con tu instrumento.',
      accentColor: '#FFD700',
      accent2: '#ff8c00',
      bgColor: '#1a1400',
      surfaceColor: '#332800',
      emoji: '🥂',
      particles: ['🥂', '🎆', '🎇', '✨', '🎉'],
      startMonth: 1,
      startDay: 1,
      endMonth: 1,
      endDay: 5,
    },
    dia_muertos: {
      tipo: 'dia_muertos',
      nombre: 'Día de Muertos',
      banner: '💀 Día de Muertos — Toca para los que ya no están',
      descripcion: 'Honra a quienes te enseñaron a amar la música.',
      accentColor: '#FF6B00',
      accent2: '#ffcc00',
      bgColor: '#1a0800',
      surfaceColor: '#2d1200',
      emoji: '💀',
      particles: ['💀', '🌼', '🕯️', '🦋', '🌺'],
      startMonth: 11,
      startDay: 1,
      endMonth: 11,
      endDay: 2,
    },
    halloween: {
      tipo: 'halloween',
      nombre: 'Halloween',
      banner: '🎃 Halloween — Ensaya de noche, suena de miedo',
      descripcion: 'Las mejores sesiones ocurren en la oscuridad.',
      accentColor: '#FF6600',
      accent2: '#9b30ff',
      bgColor: '#0d0500',
      surfaceColor: '#1a0a00',
      emoji: '🎃',
      particles: ['🎃', '👻', '🕷️', '🦇', '💀'],
      startMonth: 10,
      startDay: 28,
      endMonth: 10,
      endDay: 31,
    },
    san_valentin: {
      tipo: 'san_valentin',
      nombre: 'San Valentín',
      banner: '💖 San Valentín — Dedícale una canción a quien amas',
      descripcion: 'La música es el mejor regalo. Reserva una sala para dos.',
      accentColor: '#FF1A6E',
      accent2: '#ff69b4',
      bgColor: '#1a0010',
      surfaceColor: '#2d0020',
      emoji: '💖',
      particles: ['💖', '🌹', '💝', '🎵', '💕'],
      startMonth: 2,
      startDay: 10,
      endMonth: 2,
      endDay: 14,
    },
    default: {
      tipo: 'default',
      nombre: '',
      banner: '',
      descripcion: 'Salas de ensayo profesionales con acústica de estudio.',
      accentColor: '#C8FF00',
      accent2: '#ff4d00',
      bgColor: '#0a0a0a',
      surfaceColor: '#1a1a1a',
      emoji: '',
      particles: [],
      startMonth: 0,
      startDay: 0,
      endMonth: 0,
      endDay: 0,
    },
  };

  // ── Signal-based API (anteriormente en SeasonalThemeService) ──────────────

  private _today = signal(new Date());

  /** Evento activo reactivo; se actualiza cuando cambia _today. */
  readonly activeEvent = computed<EventoCalendario>(() =>
    this.getEventoActivo(this._today()),
  );

  /** Sobreescribe la fecha para pruebas (EventoDemoComponent). */
  setTestDate(date: Date): void {
    this._today.set(date);
  }

  /** Restaura la fecha real del sistema. */
  resetDate(): void {
    this._today.set(new Date());
  }

  /** Usado por el panel de Admin: lista todos los temas estacionales configurados. */
  getTodosLosEventos(): EventoCalendario[] {
    return (Object.keys(this.eventos) as EventoTipo[])
      .filter((k) => k !== 'default')
      .map((k) => this.eventos[k]);
  }

  /** Usado por el panel de Admin: simula la fecha de inicio de un evento para previsualizarlo. */
  previewEvento(tipo: EventoTipo): void {
    const ev = this.eventos[tipo];
    if (!ev) return;
    this._today.set(new Date(new Date().getFullYear(), ev.startMonth - 1, ev.startDay));
  }

  // ── API imperativa (usada en HeroComponent y EventoDemoComponent) ─────────

  /**
   * Retorna el EventoCalendario activo según la fecha dada (por defecto hoy).
   */
  getEventoActivo(fecha: Date = new Date()): EventoCalendario {
    const mes = fecha.getMonth() + 1; // 1-12
    const dia = fecha.getDate();

    for (const key of Object.keys(this.eventos) as EventoTipo[]) {
      if (key === 'default') continue;
      const ev = this.eventos[key];
      if (this._inRange(mes, dia, ev)) return ev;
    }

    return this.eventos['default'];
  }

  private _inRange(m: number, day: number, ev: EventoCalendario): boolean {
    if (ev.startMonth === ev.endMonth) {
      return m === ev.startMonth && day >= ev.startDay && day <= ev.endDay;
    }
    const afterStart =
      m > ev.startMonth || (m === ev.startMonth && day >= ev.startDay);
    const beforeEnd =
      m < ev.endMonth || (m === ev.endMonth && day <= ev.endDay);
    return afterStart && beforeEnd;
  }
}
