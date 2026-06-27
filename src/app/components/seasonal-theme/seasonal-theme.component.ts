import {
  Component,
  OnDestroy,
  inject,
  signal,
  effect,
  PLATFORM_ID,
} from '@angular/core';
import { NgIf, NgFor, isPlatformBrowser } from '@angular/common';
import {
  EventoCalendarioService,
  EventoCalendario,
} from '../../services/evento-calendario.service';

interface Particle {
  id: number;
  emoji: string;
  left: string;
  delay: string;
  duration: string;
  size: string;
}

@Component({
  selector: 'app-seasonal-theme',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    <div
      class="particles-layer"
      *ngIf="active().tipo !== 'default' && showParticles()"
    >
      <span
        *ngFor="let p of particles()"
        class="particle"
        [style.left]="p.left"
        [style.animation-delay]="p.delay"
        [style.animation-duration]="p.duration"
        [style.font-size]="p.size"
        >{{ p.emoji }}</span
      >
    </div>
  `,
})
export class SeasonalThemeComponent implements OnDestroy {
  private svc = inject(EventoCalendarioService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  active = this.svc.activeEvent;
  dismissed = signal(false);
  showParticles = signal(true);
  particles = signal<Particle[]>([]);

  private styleEl?: HTMLStyleElement;

  constructor() {
    effect(
      () => {
        const ev = this.active();
        // Solo ejecutamos lógica de DOM si estamos en el navegador
        if (this.isBrowser) {
          this.dismissed.set(false);
          this.applyTheme(ev);
          this.buildParticles(ev);
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.styleEl?.remove();
    }
  }

  dismiss(): void {
    this.dismissed.set(true);
    this.showParticles.set(false);
  }

  private applyTheme(ev: EventoCalendario): void {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = 'np-seasonal-theme';
      document.head.appendChild(this.styleEl);
    }

    if (ev.tipo !== 'default') {
      this.styleEl.textContent = `
        :root {
          --np-accent:      ${ev.accentColor};
          --np-accent2:     ${(ev as any).accent2 || '#ff4d00'};
          --np-black:       ${ev.bgColor};
          --np-surface:     ${(ev as any).surfaceColor || '#1a1a1a'};
          --season-accent:  ${ev.accentColor};
        }
        body { background: ${ev.bgColor}; }
      `;
    } else {
      this.styleEl.textContent = `
        :root {
          --np-accent:   #c8ff00;
          --np-accent2:  #ff4d00;
          --np-black:    #0a0a0a;
          --np-surface:  #1a1a1a;
        }
        body { background: #0a0a0a; }
      `;
    }
  }

  private buildParticles(ev: EventoCalendario): void {
    const eventParticles = (ev as any).particles;
    if (ev.tipo === 'default' || !eventParticles || !eventParticles.length) {
      this.particles.set([]);
      return;
    }

    const list: Particle[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      emoji: eventParticles[i % eventParticles.length],
      left: `${Math.random() * 100}%`,
      delay: `${(Math.random() * 8).toFixed(1)}s`,
      duration: `${(6 + Math.random() * 7).toFixed(1)}s`,
      size: `${18 + Math.floor(Math.random() * 18)}px`,
    }));

    this.particles.set(list);
    this.showParticles.set(true);
  }
}
