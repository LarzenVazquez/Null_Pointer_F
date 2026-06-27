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
  styles: [
    `
      .particles-layer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        animation: fadeOut 2s ease-in-out forwards;
        animation-delay: 2s;
      }
      @keyframes fadeOut {
        to {
          opacity: 0;
          visibility: hidden;
        }
      }
    `,
  ],
})
export class SeasonalThemeComponent implements OnDestroy {
  private svc = inject(EventoCalendarioService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  active = this.svc.activeEvent;
  showParticles = signal(true);
  particles = signal<Particle[]>([]);

  private styleEl?: HTMLStyleElement;

  constructor() {
    effect(
      () => {
        const ev = this.active();
        if (this.isBrowser) {
          this.applyTheme(ev);
          this.buildParticles(ev);
          setTimeout(() => this.showParticles.set(false), 4000);
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
          --np-black:       ${ev.bgColor};
          --season-accent:  ${ev.accentColor};
        }
        body { background: ${ev.bgColor}; }
      `;
    } else {
      this.styleEl.textContent = `
        :root {
          --np-accent:   #c8ff00;
          --np-black:    #0a0a0a;
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
      delay: `${(Math.random() * 2).toFixed(1)}s`,
      duration: `${(3 + Math.random() * 2).toFixed(1)}s`,
      size: `${18 + Math.floor(Math.random() * 18)}px`,
    }));

    this.particles.set(list);
    this.showParticles.set(true);
  }
}
