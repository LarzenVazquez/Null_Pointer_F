import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  effect,
} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { SeasonalThemeService, SeasonalEvent } from '../../services/seasonal-theme.service';

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
    <!-- Banner superior -->
    <div class="season-banner" *ngIf="active()">
      <span class="banner-msg">{{ active()!.bannerMsg }}</span>
      <button class="banner-close" (click)="dismiss()">✕</button>
    </div>

    <!-- Partículas flotantes -->
    <div class="particles-layer" *ngIf="active() && showParticles()">
      <span
        *ngFor="let p of particles()"
        class="particle"
        [style.left]="p.left"
        [style.animation-delay]="p.delay"
        [style.animation-duration]="p.duration"
        [style.font-size]="p.size"
      >{{ p.emoji }}</span>
    </div>
  `,
  styles: [`
    /* ---- Banner ---- */
    .season-banner {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      background: var(--season-accent, var(--np-accent));
      color: #000;
      font-family: var(--font-mono);
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 10px 48px 10px 20px;
      text-align: center;
      animation: slideDown 0.4s ease;
    }

    .banner-msg { display: inline-block; }

    .banner-close {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      color: #000;
      line-height: 1;
    }

    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to   { transform: translateY(0); }
    }

    /* ---- Partículas ---- */
    .particles-layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      top: -60px;
      animation: fall linear infinite;
      opacity: 0.85;
      user-select: none;
    }

    @keyframes fall {
      0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0.9; }
      80%  { opacity: 0.6; }
      100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
    }
  `],
})
export class SeasonalThemeComponent implements OnInit, OnDestroy {
  private svc = inject(SeasonalThemeService);

  active    = this.svc.activeEvent;
  dismissed = signal(false);
  showParticles = signal(true);
  particles = signal<Particle[]>([]);

  private styleEl?: HTMLStyleElement;

  constructor() {
    // Reacciona a cambios del evento activo
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

  // Inyecta CSS variables en <head> para colorear TODO el sitio
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
      // Restaura tema original
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
    if (!ev) { this.particles.set([]); return; }

    const list: Particle[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      emoji:    ev.particles[i % ev.particles.length],
      left:     `${Math.random() * 100}%`,
      delay:    `${(Math.random() * 8).toFixed(1)}s`,
      duration: `${(6 + Math.random() * 7).toFixed(1)}s`,
      size:     `${18 + Math.floor(Math.random() * 18)}px`,
    }));

    this.particles.set(list);
    this.showParticles.set(true);
  }
}
