// src/app/services/seasonal-theme.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface SeasonalEvent {
  name: string;
  key: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  accent: string;
  accent2: string;
  bgColor: string;
  surfaceColor: string;
  particles: string[];
  bannerMsg: string;
}

@Injectable({ providedIn: 'root' })
export class SeasonalThemeService {
  readonly events: SeasonalEvent[] = [
    {
      name: 'Halloween',
      key: 'halloween',
      startMonth: 10,
      startDay: 28,
      endMonth: 10,
      endDay: 31,
      accent: '#FF6600',
      accent2: '#9b30ff',
      bgColor: '#0d0500',
      surfaceColor: '#1a0a00',
      particles: ['🎃', '👻', '🕷️', '🦇', '💀'],
      bannerMsg:
        '🎃 Halloween en Null Pointer! Ensaya de noche, suena de miedo.',
    },
    {
      name: 'Día de Muertos',
      key: 'dia_muertos',
      startMonth: 11,
      startDay: 1,
      endMonth: 11,
      endDay: 2,
      accent: '#FF6B00',
      accent2: '#ffcc00',
      bgColor: '#1a0800',
      surfaceColor: '#2d1200',
      particles: ['💀', '🌼', '🕯️', '🦋', '🌺'],
      bannerMsg: '💀 Día de Muertos — Toca para los que ya no están.',
    },
    {
      name: 'Navidad',
      key: 'navidad',
      startMonth: 12,
      startDay: 20,
      endMonth: 12,
      endDay: 31,
      accent: '#00C853',
      accent2: '#ff0000',
      bgColor: '#001a00',
      surfaceColor: '#003300',
      particles: ['🎄', '⭐', '🎅', '🦌', '🎁', '❄️'],
      bannerMsg:
        '🎄 Oferta Navideña — 20% off en ensayos del 20 al 31 de diciembre.',
    },
    {
      name: 'Año Nuevo',
      key: 'anio_nuevo',
      startMonth: 1,
      startDay: 1,
      endMonth: 1,
      endDay: 5,
      accent: '#FFD700',
      accent2: '#ff8c00',
      bgColor: '#1a1400',
      surfaceColor: '#332800',
      particles: ['🥂', '🎆', '🎇', '✨', '🎉'],
      bannerMsg: '🥂 Año Nuevo — ¡Estrena el año tocando con tu banda!',
    },
    {
      name: 'San Valentín',
      key: 'san_valentin',
      startMonth: 2,
      startDay: 10,
      endMonth: 2,
      endDay: 14,
      accent: '#FF1A6E',
      accent2: '#ff69b4',
      bgColor: '#1a0010',
      surfaceColor: '#2d0020',
      particles: ['💖', '🌹', '💝', '🎵', '💕'],
      bannerMsg: '💖 San Valentín — Dedícale una canción a quien amas.',
    },
  ];

  private _today = signal(new Date());

  readonly activeEvent = computed<SeasonalEvent | null>(() => {
    const d = this._today();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return this.events.find((ev) => this._inRange(m, day, ev)) ?? null;
  });

  /** Permite sobreescribir la fecha para pruebas desde EventoDemoComponent */
  setTestDate(date: Date): void {
    this._today.set(date);
  }

  /** Restaura la fecha real del sistema */
  resetDate(): void {
    this._today.set(new Date());
  }

  private _inRange(m: number, day: number, ev: SeasonalEvent): boolean {
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
