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
      startDay: 25,
      endMonth: 10,
      endDay: 31,
      accent: '#ff6b00',
      accent2: '#9b30ff',
      bgColor: '#0d0500',
      surfaceColor: '#1a0a00',
      particles: ['🎃', '👻', '🕷️', '🦇', '💀'],
      bannerMsg: '🎃 ¡Halloween en Null Pointer! Toca si te atreves...',
    },
    // ... otros eventos segun lo definido en
  ];

  private _today = signal(new Date());

  readonly activeEvent = computed<SeasonalEvent | null>(() => {
    const d = this._today();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return this.events.find((ev) => this._inRange(m, day, ev)) ?? null;
  });

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
