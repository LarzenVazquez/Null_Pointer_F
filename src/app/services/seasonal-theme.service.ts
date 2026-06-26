import { Injectable, signal, computed } from '@angular/core';

export interface SeasonalEvent {
  name: string;
  key: string;
  /** Mes 1-12, día inicio y día fin (inclusive) */
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  /** Colores que sobreescriben las CSS variables del sitio */
  accent: string;
  accent2: string;
  bgColor: string;
  surfaceColor: string;
  /** Emoji o partículas decorativas */
  particles: string[];
  /** Mensaje banner */
  bannerMsg: string;
}

@Injectable({ providedIn: 'root' })
export class SeasonalThemeService {

  // =====================================================
  //  ✏️  CONFIGURA TUS EVENTOS AQUÍ
  //  Puedes agregar, quitar o modificar cualquier bloque
  // =====================================================
  readonly events: SeasonalEvent[] = [
    {
      name: 'Halloween',
      key: 'halloween',
      startMonth: 10, startDay: 25,
      endMonth: 10,  endDay: 31,
      accent: '#ff6b00',
      accent2: '#9b30ff',
      bgColor: '#0d0500',
      surfaceColor: '#1a0a00',
      particles: ['🎃', '👻', '🕷️', '🦇', '💀'],
      bannerMsg: '🎃 ¡Halloween en Null Pointer! Toca si te atreves...',
    },
    {
      name: 'Día de Muertos',
      key: 'dia-muertos',
      startMonth: 11, startDay: 1,
      endMonth: 11,  endDay: 2,
      accent: '#ff00cc',
      accent2: '#ffcc00',
      bgColor: '#080010',
      surfaceColor: '#120020',
      particles: ['💀', '🌼', '🕯️', '🌺', '🦋'],
      bannerMsg: '🌼 Día de Muertos — La música nunca muere.',
    },
    {
      name: 'Navidad',
      key: 'navidad',
      startMonth: 12, startDay: 18,
      endMonth: 12,  endDay: 26,
      accent: '#00e676',
      accent2: '#ff1744',
      bgColor: '#001a04',
      surfaceColor: '#002206',
      particles: ['🎄', '⭐', '🎁', '❄️', '🔔'],
      bannerMsg: '🎄 ¡Felices fiestas! Ensaya en Navidad.',
    },
    {
      name: 'Año Nuevo',
      key: 'ano-nuevo',
      startMonth: 12, startDay: 31,
      endMonth: 1,   endDay: 1,
      accent: '#ffd700',
      accent2: '#00cfff',
      bgColor: '#0a0a00',
      surfaceColor: '#141400',
      particles: ['🎆', '🥂', '🎉', '✨', '🎇'],
      bannerMsg: '🎆 ¡Feliz Año Nuevo! Que el 2026 suene fuerte.',
    },
  ];
  // =====================================================

  private _today = signal(new Date());

  /** Evento activo según la fecha actual (null = tema normal) */
  readonly activeEvent = computed<SeasonalEvent | null>(() => {
    const d = this._today();
    const m = d.getMonth() + 1; // 1-12
    const day = d.getDate();

    return this.events.find(ev => this._inRange(m, day, ev)) ?? null;
  });

  private _inRange(m: number, day: number, ev: SeasonalEvent): boolean {
    // Mismo mes inicio y fin
    if (ev.startMonth === ev.endMonth) {
      return m === ev.startMonth && day >= ev.startDay && day <= ev.endDay;
    }
    // Rango cruza mes (ej. dic 31 → ene 1)
    const afterStart = m > ev.startMonth || (m === ev.startMonth && day >= ev.startDay);
    const beforeEnd  = m < ev.endMonth   || (m === ev.endMonth   && day <= ev.endDay);
    return afterStart && beforeEnd;
  }

  /** Fuerza una fecha distinta (útil para probar temas en desarrollo) */
  setTestDate(date: Date): void {
    this._today.set(date);
  }

  resetDate(): void {
    this._today.set(new Date());
  }
}
