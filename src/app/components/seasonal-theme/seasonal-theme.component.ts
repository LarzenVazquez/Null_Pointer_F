// src/app/components/seasonal-theme/seasonal-theme.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  effect,
} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import {
  SeasonalThemeService,
  SeasonalEvent,
} from '../../services/seasonal-theme.service';

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
    <div class="season-banner" *ngIf="active() && !dismissed()">
      <span class="banner-msg">{{ active()!.bannerMsg }}</span>
      <button class="banner-close" (click)="dismiss()">✕</button>
    </div>

    <div class="particles-layer" *ngIf="active() && showParticles()">
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
export class SeasonalThemeComponent implements OnInit, OnDestroy {
  private svc = inject(SeasonalThemeService);

  active = this.svc.activeEvent;
  dismissed = signal(false);
  showParticles = signal(true);
  particles = signal<Particle[]>([]);

  private styleEl?: HTMLStyleElement;

  constructor() {
    effect(() => {
      const ev = this.active();
      this.dismissed.set(false);
      this.applyTheme(ev);
      this.buildParticles(ev);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.styleEl?.remove();
  }

  dismiss(): void {
    this.dismissed.set(true);
    this.showParticles.set(false);
  }

  private applyTheme(ev: SeasonalEvent | null): void {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = 'np-seasonal-theme';
      document.head.appendChild(this.styleEl);
    }

    if (ev) {
      this.styleEl.textContent = `
        :root {
          --np-accent:      ${ev.accent};
          --np-accent2:     ${ev.accent2};
          --np-black:       ${ev.bgColor};
          --np-surface:     ${ev.surfaceColor};
          --season-accent:  ${ev.accent};
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

  private buildParticles(ev: SeasonalEvent | null): void {
    if (!ev) {
      this.particles.set([]);
      return;
    }

    const list: Particle[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      emoji: ev.particles[i % ev.particles.length],
      left: `${Math.random() * 100}%`,
      delay: `${(Math.random() * 8).toFixed(1)}s`,
      duration: `${(6 + Math.random() * 7).toFixed(1)}s`,
      size: `${18 + Math.floor(Math.random() * 18)}px`,
    }));

    this.particles.set(list);
    this.showParticles.set(true);
  }
}
