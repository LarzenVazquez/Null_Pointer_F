// src/app/components/hero/hero.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  EventoCalendarioService,
  EventoCalendario,
} from '../../services/evento-calendario.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgIf],
  template: `
    <!-- Banner de evento calendarizado -->
    <div
      *ngIf="evento().banner"
      class="np-event-banner"
      [style.background]="evento().accentColor"
    >
      <span>{{ evento().banner }}</span>
      <button class="np-event-close" (click)="cerrarBanner()">✕</button>
    </div>

    <section class="np-hero" [style.background]="evento().bgColor">
      <div class="np-hero-bg-text">NP</div>

      <div
        *ngIf="evento().emoji"
        class="np-event-badge"
        [style.border-color]="evento().accentColor"
      >
        <span>{{ evento().emoji }}</span>
        <span [style.color]="evento().accentColor">{{ evento().nombre }}</span>
      </div>

      <div class="np-hero-eyebrow">// Queretaro, Mexico</div>
      <h1>
        Donde el<br />
        sonido
        <span class="glitch" [style.color]="evento().accentColor">importa</span
        >.
      </h1>
      <p class="np-hero-sub">
        Salas de ensayo profesionales con acustica de estudio.
      </p>
      <div class="np-hero-actions">
        <button
          class="btn-primary"
          [style.background]="evento().accentColor"
          [style.color]="
            evento().tipo !== 'default' ? '#fff' : 'var(--np-black)'
          "
        >
          → Reservar sala
        </button>
        <button class="btn-secondary">Ver salas</button>
      </div>
      <div class="np-hero-stats">
        <div class="np-stat">
          <div class="np-stat-val">3</div>
          <div class="np-stat-lbl">Salas disponibles</div>
        </div>
        <div class="np-stat">
          <div class="np-stat-val">24h</div>
          <div class="np-stat-lbl">Acceso</div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  private eventoService = inject(EventoCalendarioService);

  private bannerVisible = signal(true);

  // Computed que combina el evento activo del servicio con el estado local del banner
  evento = computed<EventoCalendario>(() => ({
    ...this.eventoService.activeEvent(),
    banner: this.bannerVisible() ? this.eventoService.activeEvent().banner : '',
  }));

  cerrarBanner(): void {
    this.bannerVisible.set(false);
  }
}
